import {IUserDto} from "src/common/dtos";

export function convertUserToIUserDto (user: any): IUserDto {
  return {
    avatar: user.avatar,
    active: user.active,
    rang: user.rang,
    lastName: user.lastName,
    firstName: user.firstName,
    phoneNumber: user.phoneNumber,
    dispatch: user.dispatch,
    refreshToken: user.refreshToken,
    usernameDiscord: user.usernameDiscord,
  }
}
