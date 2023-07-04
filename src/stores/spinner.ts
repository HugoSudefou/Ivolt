import { defineStore } from 'pinia'

export const useSpinnerStore = defineStore({
  id: 'spinner',
  state: () => ({
    isLoading: false,
    pendingRequests: 0
  }),
  actions: {
    clear () {
      this.$patch({
        isLoading: false,
        pendingRequests: 0
      })
    },
    incrementPendingRequests () {
      this.$patch({
        isLoading: true,
        pendingRequests: this.pendingRequests + 1
      })
    },
    decrementPendingRequests () {
      this.pendingRequests--
      if (this.pendingRequests === 0) {
        this.$patch({
          isLoading: false
        })
      }
    }
  }
})
