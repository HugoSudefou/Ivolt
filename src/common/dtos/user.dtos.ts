import {IDispatchDto, IRangDto} from "src/common/dtos/firebase.dto";
import {DocumentData, DocumentReference} from "firebase/firestore";

export interface IUserDto {
  id: string;
  active: boolean;
  avatar: string;
  dispatch: IDispatchDto;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  rang: IRangDto;
  usernameDiscord: string;
  refreshToken: string;
}
