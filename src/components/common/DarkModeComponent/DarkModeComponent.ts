import { computed, defineComponent, onMounted, ref } from 'vue';
import { useDarkModeStore } from 'stores/dark-mode';

export default defineComponent({
  name: 'DarkModeComponent',
  setup() {
    const darkModeStore = useDarkModeStore();
    const darkMode = ref<boolean>(false);

    function toggleDarkMode(isDark: any) {
      darkModeStore.switchDarkMode(isDark);
    }

    onMounted(() => {
      darkMode.value = darkModeStore.isDarkMode;
    });

    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      toggleDarkMode,
      darkMode,
    };
  },
});
