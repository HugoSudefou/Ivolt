import { AbstractFirebaseService } from 'src/services/apis/abstract-firebase.service';
import { WorkDone } from 'src/common/utils';
import { MessageEnum } from 'src/common/enums/message.enum';
import { IStockDtos, ITransactionStockDtos } from 'src/common/dtos/stock.dtos';

export class StockService extends AbstractFirebaseService<
  IStockDtos | ITransactionStockDtos
> {
  protected collectionPath = 'stock';

  /**
   * Function qui permet de créer un transaction dans le stock total de batterie de I-Volt
   * Pour ça on ajoute un stock (ici transactionStock) à la bdd stock
   * @param transactionStock
   */
  public async addTransactionStock(
    transactionStock: ITransactionStockDtos,
  ): Promise<WorkDone<IStockDtos | null>> {
    try {
      const idCreateStrock = await this.add(transactionStock);
      const stock = await this.get(idCreateStrock);
      if (stock) {
        const newStock = (await this.mergeReferencedData(
          stock as IStockDtos,
          'user',
        )) as IStockDtos;
        newStock.id = idCreateStrock;
        return this._thenHandler(
          WorkDone.buildOk(newStock, MessageEnum.IS_OK_ADD_TRANSACTION_STOCK),
        );
      }
      return this._catchHandler(
        WorkDone.buildError(MessageEnum.IS_NOK_ADD_TRANSACTION_STOCK),
      );
    } catch (e) {
      return this._catchHandler(WorkDone.buildError((e as Error).message));
    }
  }

  /*
    /!**
     * Function qui récupère sur firebase un utilisateur en fonction de sont username discord
     * Username discord qu'on récupère lors de la connexion de l'utilisateur via discord
     * @param usernameDiscord
     *!/
    public async getUserByUsernameDiscord(usernameDiscord: string): Promise<WorkDone<IUserDto | null>> {
      const querySnapshot = await this._queryByFields([{field: 'usernameDiscord', operator: '==', value: usernameDiscord}, {field: 'active', operator: '==', value: true}]);
      if (!querySnapshot.empty) {
        return WorkDone.buildOk(convertUserToIUserDto(querySnapshot.docs[0].data()), MessageEnum.IS_OK_GET_USER_BY_USERNAME_DISCORD);
      }
      return WorkDone.buildError(MessageEnum.IS_NOK_GET_USER_BY_USERNAME_DISCORD);
    }

    /!**
     * Function qui récupère sur firebase tous les utilisateurs
     *!/
    public async getAllUser(): Promise<WorkDone<IUserDto[]>> {
      const allUser = await this.getAll();
      if (allUser.length > 0) {
        const newAllUser: IUserDto[] = [];
        for await (const user of allUser) {
          let newUser = await this.mergeReferencedData(user, 'rang');
          newUser = await this.mergeReferencedData(newUser, 'dispatch');
          newAllUser.push(newUser);
        }
        return WorkDone.buildOk(newAllUser.map(convertUserToIUserDto), MessageEnum.IS_OK_GET_ALL_USER);
      }
      return WorkDone.buildError(MessageEnum.IS_NOK_GET_ALL_USER);
    }*/
}
