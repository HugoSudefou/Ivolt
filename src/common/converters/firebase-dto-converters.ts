import { IUserDto } from 'src/common/dtos';
import {
  IFormTransactionStockDtos,
  ITransactionStockDtos,
} from 'src/common/dtos/stock.dtos';
import { doc } from 'firebase/firestore';
import { firebaseDatabase } from 'boot/iv-api';
import { Timestamp } from '@firebase/firestore';

export function convertUserToIUserDto(user: any): IUserDto {
  return {
    id: user.id,
    avatar: user.avatar,
    active: user.active,
    rang: user.rang,
    lastName: user.lastName,
    firstName: user.firstName,
    phoneNumber: user.phoneNumber,
    dispatch: user.dispatch,
    refreshToken: user.refreshToken,
    usernameDiscord: user.usernameDiscord,
  };
}

export function convertIFormTransactionStockDtosToITransactionStockDtos(
  formTransactionStock: IFormTransactionStockDtos,
): ITransactionStockDtos {
  const userDoc = doc(
    firebaseDatabase,
    `/user/${formTransactionStock.user.id}`,
  );
  const date = Timestamp.now();
  return {
    date: date,
    nbBatterie: formTransactionStock.nbBatterie || 0,
    action: formTransactionStock.action,
    user: userDoc,
  };
}
