import { IUserDto } from 'src/common/dtos/user.dtos';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import firebase from 'firebase/compat';
import firestore = firebase.firestore;

export interface IStockDtos {
  id: string;
  action: string;
  date: Date;
  nbBatterie: number;
  user: IUserDto;
}

export interface ITransactionStockDtos {
  action: string;
  date: firestore.Timestamp;
  nbBatterie: number;
  user: DocumentReference<DocumentData>;
}

export interface IFormTransactionStockDtos {
  action: string;
  date: number;
  nbBatterie: number | null;
  user: { label: string; id: string };
}
