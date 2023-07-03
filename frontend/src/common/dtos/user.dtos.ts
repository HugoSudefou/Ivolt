import {IRangDto} from "src/common/dtos/firebase.dto";
import {DocumentData, DocumentReference} from "firebase/firestore";

export interface IUserDto {
  active: boolean;
  avatar: string;
  dispatch: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  rang: IRangDto | DocumentReference<DocumentData>;
  usernameDiscord: string;
  refreshToken: string;
}
