import {computed, defineComponent, ref} from 'vue';
import {useUserStore} from "stores/user";
import UserModalComponent from "components/modal/UserModalComponent/UserModalComponent.vue";
import {sessionStorageService} from "boot/iv-api";
import {useRouter} from "vue-router";
import {useDarkModeStore} from "stores/dark-mode";

export default defineComponent({
  name: 'MainLayout',
    components: {UserModalComponent},
  setup() {
    const router = useRouter();
    const leftDrawerOpen = ref(false);

    const userStore = useUserStore()
    const darkModeStore = useDarkModeStore()
    const userProfileModalVisible = ref(false)

    const openUserProfileModal = () => {
      userProfileModalVisible.value = true
    }
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function logout() {
      sessionStorageService.logout();
      userStore.clear();
      router.push('/login')
    }

    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      logout,
      userStore,
      openUserProfileModal,
      userProfileModalVisible,
      toggleLeftDrawer,
      leftDrawerOpen,
    };
  },
});
