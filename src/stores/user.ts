import { defineStore } from 'pinia'
import {IDispatchDto, IRangDto, IUserDto} from "src/common/dtos";
import {userService} from "boot/iv-api";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: '',
    active: false,
    avatar: '',
    rang: {
      label: '',
      color: '',
    },
    dispatch: {
      label: ''
    },
    firstName: '',
    lastName: '',
    phoneNumber: '',
    updated: false
  }),
  getters: {
    getState: (state) => state
  },
  actions: {
    clear () {
      this.$patch({
        id: '',
        active: false,
        avatar: '',
        rang: {
          label: ''
        },
        dispatch: {
          label: ''
        },
        firstName: '',
        lastName: '',
        phoneNumber: '',
      })
    },
    setUser(user: IUserDto) {
      this.$patch({
        id: user.id,
        active: user.active,
        avatar: user.avatar,
        rang: (user.rang as IRangDto),
        dispatch: (user.dispatch as IDispatchDto),
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        updated: true,
      })
    },
    async updateFromLocalStorage() {
      const storedData = localStorage.getItem('IVoltUser')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        const test = await userService.getById(parsedData.id);
        console.log('---------test---------')
        console.log(test)
        console.log('---------test---------')
        if(test.isOk && test.data) {
          this.setUser(test.data)
        } else {
          this.setUser(parsedData)
        }
      }
    },
  },
})
