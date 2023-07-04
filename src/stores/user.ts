import { defineStore } from 'pinia'
import {IRangDto, IUserDto} from "src/common/dtos";
import { onBeforeMount } from 'vue'

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
  getters: {
    getState: (state) => state
  },
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
    },
    onBeforeMount() {
      const storedData = localStorage.getItem('IVoltUser')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        this.setUser(parsedData as IUserDto) // Utilisez votre action pour mettre à jour les données du store
      }
    },
    onUnmounted() {
      const stateData = JSON.stringify(this.getState) // Convertit l'état du store en JSON
      localStorage.setItem('IVoltUser', stateData) // Enregistre les données dans le localStorage
    },
    updateFromLocalStorage() {
      const storedData = localStorage.getItem('IVoltUser')
      if (storedData) {
        const parsedData = JSON.parse(storedData)
        this.setUser(parsedData)
      }
    },
  },

/*  onBeforeMount() {
    const storedData = localStorage.getItem('IVoltUser')
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      this.setUser(parsedData as IUserDto) // Utilisez votre action pour mettre à jour les données du store
    }
  },
  onUnmounted() {
    const stateData = JSON.stringify(this.getState()) // Convertit l'état du store en JSON
    localStorage.setItem(STORAGE_KEY, stateData) // Enregistre les données dans le localStorage
  },*/
})
