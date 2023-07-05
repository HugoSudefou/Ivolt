import { doc } from 'firebase/firestore';
import { AbstractFirebaseService } from 'src/services/apis/abstract-firebase.service';
import { IUserDto } from 'src/common/dtos';
import { convertUserToIUserDto } from 'src/common/converters/firebase-dto-converters';
import { WorkDone } from 'src/common/utils';
import { MessageEnum } from 'src/common/enums/message.enum';
import { firebaseDatabase } from 'boot/iv-api';

export class UserService extends AbstractFirebaseService<IUserDto> {
  protected collectionPath = 'user';

  /**
   * Function qui récupère sur firebase un utilisateur en fonction de sont username discord
   * Username discord qu'on récupère lors de la connexion de l'utilisateur via discord
   * @param usernameDiscord {string}
   * @param avatar {string}
   * @param firstName {string}
   * @param lastName {string}
   * @param refreshToken {string}
   */
  public async getOrCreateUserByUsernameDiscord(
    usernameDiscord: string,
    avatar: string,
    firstName: string,
    lastName: string,
    refreshToken: string,
  ): Promise<WorkDone<IUserDto | null>> {
    const querySnapshot = await this._queryByField({
      field: 'usernameDiscord',
      operator: '==',
      value: usernameDiscord,
    });
    if (!querySnapshot.empty) {
      let user = await this.mergeReferencedData(
        querySnapshot.docs[0].data() as IUserDto,
        'rang',
      );
      user = await this.mergeReferencedData(user, 'dispatch');
      user.id = querySnapshot.docs[0].id;
      if (user.active) {
        return WorkDone.buildOk(
          user,
          MessageEnum.IS_OK_GET_USER_BY_USERNAME_DISCORD,
        );
      }
    }

    await this.add({
      active: true,
      lastName: lastName,
      firstName: firstName,
      avatar: avatar,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rang: doc(firebaseDatabase, '/rang/ADJOINT'),
      phoneNumber: '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      dispatch: doc(firebaseDatabase, '/dispatch/DISPONIBLE'),
      usernameDiscord: usernameDiscord,
      refreshToken: refreshToken,
    });

    const queryCreateUserSnapshot = await this._queryByField({
      field: 'usernameDiscord',
      operator: '==',
      value: usernameDiscord,
    });
    if (!queryCreateUserSnapshot.empty) {
      let createUser = await this.mergeReferencedData(
        queryCreateUserSnapshot.docs[0].data() as IUserDto,
        'rang',
      );
      createUser = await this.mergeReferencedData(createUser, 'dispatch');
      createUser.id = queryCreateUserSnapshot.docs[0].id;
      if (createUser.active) {
        return WorkDone.buildOk(
          createUser,
          MessageEnum.IS_OK_CREATE_USER_BY_USERNAME_DISCORD,
        );
      }
    }

    return WorkDone.buildError(MessageEnum.IS_NOK_GET_USER_BY_USERNAME_DISCORD);
  }

  /**
   * Function qui récupère sur firebase un utilisateur en fonction de sont username discord
   * Username discord qu'on récupère lors de la connexion de l'utilisateur via discord
   * @param usernameDiscord
   */
  public async getUserByUsernameDiscord(
    usernameDiscord: string,
  ): Promise<WorkDone<IUserDto | null>> {
    const querySnapshot = await this._queryByFields([
      {
        field: 'usernameDiscord',
        operator: '==',
        value: usernameDiscord,
      },
      { field: 'active', operator: '==', value: true },
    ]);
    if (!querySnapshot.empty) {
      return WorkDone.buildOk(
        convertUserToIUserDto(querySnapshot.docs[0].data()),
        MessageEnum.IS_OK_GET_USER_BY_USERNAME_DISCORD,
      );
    }
    return WorkDone.buildError(MessageEnum.IS_NOK_GET_USER_BY_USERNAME_DISCORD);
  }

  /**
   * Function qui récupère sur firebase tous les utilisateurs
   */
  public async getAllUser(): Promise<WorkDone<IUserDto[]>> {
    const allUser = await this.getAll();
    console.log('***************************');
    console.log('************allUser***************');
    console.log(allUser);
    console.log('***************************');
    if (allUser.length > 0) {
      const newAllUser: IUserDto[] = [];
      for await (const user of allUser) {
        console.log('***************************');
        console.log('************user***************');
        console.log(user);
        console.log('***************************');
        let newUser = await this.mergeReferencedData(user, 'rang');
        newUser = await this.mergeReferencedData(newUser, 'dispatch');
        console.log('***************************');
        console.log('*************newUser**************');
        console.log(newUser);
        console.log('***************************');
        newAllUser.push(newUser);
      }
      return WorkDone.buildOk(
        newAllUser.map(convertUserToIUserDto),
        MessageEnum.IS_OK_GET_ALL_USER,
      );
    }
    return WorkDone.buildError(MessageEnum.IS_NOK_GET_ALL_USER);
  }

  /**
   * Function qui récupère sur firebaseun ustilisateur via son id
   */
  public async getById(id: string): Promise<WorkDone<IUserDto>> {
    let user = await this.get(id);
    if (user) {
      user = await this.mergeReferencedData(user, 'rang');
      user = await this.mergeReferencedData(user, 'dispatch');
      user.id = id;
      return WorkDone.buildOk(
        convertUserToIUserDto(user),
        MessageEnum.IS_OK_GET_ALL_USER,
      );
    }
    return WorkDone.buildError(MessageEnum.IS_NOK_GET_ALL_USER);
  }

  public startListeningForUsers(
    callback: (users: IUserDto[]) => void,
  ): () => void {
    return this.onSnapshot(callback);
  }
}
