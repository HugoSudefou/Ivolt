import { useQuasar } from 'quasar';
import {computed, defineComponent, onMounted, ref} from 'vue';
import {useDarkModeStore} from "stores/dark-mode";
import DarkModeComponent from "components/common/DarkModeComponent/DarkModeComponent.vue";

export default defineComponent({
  name: 'LoginLayout',
  components: {
    DarkModeComponent
  },
  setup() {
    const $q = useQuasar();
    const darkModeStore = useDarkModeStore();
    const darkMode = ref<boolean>(false)

    function toggleDarkMode(isDark: any) {
      console.log('--isLight ! ', isDark)
      darkModeStore.switchDarkMode(isDark)
    }

    onMounted(() => {
      darkMode.value = darkModeStore.isDarkMode
    })

    return {
      $q,
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      toggleDarkMode,
      darkMode,
    };
  },
});
