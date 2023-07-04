import { defineStore } from 'pinia';

export const useDarkModeStore = defineStore('darkMode', {
  state: () => ({
    isDarkMode: false,
  }),
  actions: {
    switchDarkMode (dark: boolean) {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
      this.$patch({
        isDarkMode: dark
      })
    },
    updateFromLocalStorage() {
      const themeData = localStorage.getItem('theme')
      this.switchDarkMode(themeData == 'dark')
    },
  }
});
