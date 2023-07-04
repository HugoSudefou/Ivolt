import {useUserStore} from 'stores/user'
import {IUserDto} from "src/common/dtos";

export class SessionStorageService {
  static initNewTabStorage () {
    window.addEventListener('storage', (event) => {
      if (event.key == 'connected') {
        useUserStore().updated = true
      }
    })
  }

  public isConnected (): boolean {
    return localStorage.getItem('connected') !== null && localStorage.getItem('connected') === 'true';
  }

  public getIvUserData (): IUserDto | null {
    const ivUserS = localStorage.getItem('IVoltUser')
    if (ivUserS) {
      return JSON.parse(ivUserS) as IUserDto
    }
    return null
  }

  public removeIvUserData () {
    localStorage.removeItem('IVoltUser')
  }

  public logout () {
    this.removeIvUserData()
    localStorage.setItem('connected', String(false))
  }

  public setIvUserData (ivUserData: IUserDto) {
    localStorage.setItem('IVoltUser', JSON.stringify(ivUserData))
    localStorage.setItem('connected', String(true))
  }

  public setData (user: IUserDto) {
    const data = this.getIvUserData()

    const ivUserData: IUserDto = {
      id: user.id ?? data?.id,
      active: user.active ?? data?.active,
      avatar: user.avatar ?? data?.avatar,
      rang: user.rang ?? data?.rang,
      dispatch: user.dispatch ?? data?.dispatch,
      firstName: user.firstName ?? data?.firstName,
      lastName: user.lastName ?? data?.lastName,
      phoneNumber: user.phoneNumber ?? data?.phoneNumber,
      usernameDiscord: user.usernameDiscord ?? data?.usernameDiscord,
      refreshToken: user.refreshToken ?? data?.refreshToken,
    }
    localStorage.setItem('IVoltUser', JSON.stringify(ivUserData))
  }
}
