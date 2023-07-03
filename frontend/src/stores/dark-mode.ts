import { defineStore } from 'pinia';

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDarkMode: false,
  }),
  actions: {
    switchDarkMode (dark: boolean) {
      this.$patch({
        isDarkMode: dark
      })
    }
  }
});
