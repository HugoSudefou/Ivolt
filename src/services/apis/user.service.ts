import {doc, DocumentData, getDocs, query as _query, QuerySnapshot, where,} from 'firebase/firestore';
import {AbstractFirebaseService} from 'src/services/apis/abstract-firebase.service';
import {IUserDto, WhereFirestore} from "src/common/dtos";
import {convertUserToIUserDto} from "src/common/converters/firebase-dto-converters";
import {WorkDone} from "src/common/utils";
import {MessageEnum} from "src/common/enums/message.enum";
import {firebaseDatabase} from "boot/iv-api";

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
  public async getOrCreateUserByUsernameDiscord(usernameDiscord: string, avatar: string, firstName: string, lastName: string, refreshToken: string): Promise<WorkDone<IUserDto | null>> {
    const querySnapshot = await this._queryByField({field: 'usernameDiscord', operator: '==', value: usernameDiscord});
    if (!querySnapshot.empty) {
      const user = await this.mergeReferencedData(querySnapshot.docs[0].data() as IUserDto, 'rang');
      if(user.active) {
        return WorkDone.buildOk(user, MessageEnum.IS_OK_GET_USER_BY_USERNAME_DISCORD);
      }
    }

    await this.add({
      active: true,
      lastName: lastName,
      firstName: firstName,
      avatar: avatar,
      rang: doc(firebaseDatabase, '/rang/ADJOINT'),
      phoneNumber: '',
      dispatch: '',
      usernameDiscord: usernameDiscord,
      refreshToken: refreshToken,
    })

    const queryCreateUserSnapshot = await this._queryByField({field: 'usernameDiscord', operator: '==', value: usernameDiscord});
    if (!queryCreateUserSnapshot.empty) {
      const createUser = await this.mergeReferencedData(queryCreateUserSnapshot.docs[0].data() as IUserDto, 'rang');
      if(createUser.active) {
        return WorkDone.buildOk(createUser, MessageEnum.IS_OK_CREATE_USER_BY_USERNAME_DISCORD);
      }
    }

    return WorkDone.buildError(MessageEnum.IS_NOK_GET_USER_BY_USERNAME_DISCORD);
  }

  /**
   * Function qui récupère sur firebase un utilisateur en fonction de sont username discord
   * Username discord qu'on récupère lors de la connexion de l'utilisateur via discord
   * @param usernameDiscord
   */
  public async getUserByUsernameDiscord(usernameDiscord: string): Promise<WorkDone<IUserDto | null>> {
    const querySnapshot = await this._queryByFields([{field: 'usernameDiscord', operator: '==', value: usernameDiscord}, {field: 'active', operator: '==', value: true}]);
    if (!querySnapshot.empty) {
      return WorkDone.buildOk(convertUserToIUserDto(querySnapshot.docs[0].data()), MessageEnum.IS_OK_GET_USER_BY_USERNAME_DISCORD);
    }
    return WorkDone.buildError(MessageEnum.IS_NOK_GET_USER_BY_USERNAME_DISCORD);
  }

  /**
   * Function qui récupère sur firebase tous les utilisateurs
   */
  public async getAllUser(): Promise<WorkDone<IUserDto[]>> {
    const allUser = await this.getAll();
    if (allUser.length > 0) {
      return WorkDone.buildOk(allUser.map(convertUserToIUserDto), MessageEnum.IS_OK_GET_ALL_USER);
    }
    return WorkDone.buildError(MessageEnum.IS_NOK_GET_ALL_USER);
  }

  /**
   * Permet de faire une requête sur firebase (sur la table user uniquement) avec un seul champ dans le where
   * @param whereData {WhereFirestore}
   */
  private async _queryByField(
    whereData: WhereFirestore
  ): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = this.getCollectionRef();
    const query = _query(collectionRef, where(whereData.field, whereData.operator, whereData.value));
    return await getDocs<DocumentData>(query);
  }

  /**
   * Permet de faire une requête sur firebase (sur la table user uniquement) avec un plusieurs champs dans le where
   * @param whereData {WhereFirestore[]}
   * @private
   */
  private async _queryByFields(
    whereData: WhereFirestore[]
  ): Promise<QuerySnapshot<DocumentData>> {
    const collectionRef = this.getCollectionRef();
    const conditions = whereData.map((whereClause) => {
      return where(whereClause.field, whereClause.operator, whereClause.value);
    });
    const composedQuery = _query(collectionRef, ...conditions);

    return await getDocs<DocumentData>(composedQuery);
  }
}
