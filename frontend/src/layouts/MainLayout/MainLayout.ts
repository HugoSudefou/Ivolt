import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import DarkModeComponent from "components/DarkModeComponent/DarkModeComponent.vue";

export default defineComponent({
  name: 'MainLayout',
    components: {DarkModeComponent},
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }
    return {
      $q,
      toggleLeftDrawer,
      leftDrawerOpen,
    };
  },
});
