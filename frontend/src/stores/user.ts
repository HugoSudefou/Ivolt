import { defineStore } from 'pinia'
import {IRangDto, IUserDto} from "src/common/dtos";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    active: false,
    avatar: '',
    rang: '',
    dispatch: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    updated: false
  }),
  actions: {
    clear () {
      this.$patch({
        active: false,
        avatar: '',
        rang: '',
        dispatch: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
      })
    },
    setUser(user: IUserDto) {
      this.$patch({
        active: user.active,
        avatar: user.avatar,
        rang: (user.rang as IRangDto).label,
        dispatch: user.dispatch,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        updated: true,
      })
    }
  }
})
