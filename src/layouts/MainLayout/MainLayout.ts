import {computed, defineComponent, ref} from 'vue';
import {useUserStore} from "stores/user";
import UserModalComponent from "components/modal/UserModalComponent/UserModalComponent.vue";
import {sessionStorageService} from "boot/iv-api";
import {useRouter} from "vue-router";
import {useDarkModeStore} from "stores/dark-mode";
import EssentialLink from "components/common/EssentialLinkComponent/EssentialLinkComponent.vue";

const linksList = [
  {
    title: 'Home',
    caption: 'quasar.dev',
    icon: 'home',
    link: ''
  },
  {
    title: 'Test',
    caption: 'test',
    icon: 'test',
    link: '/test'
  },
]

const linksListAdmin = [
  {
    title: 'AdminHome',
    caption: 'quasar.dev',
    icon: 'home',
    link: '/adminHome'
  },
]
export default defineComponent({
  name: 'MainLayout',
    components: {EssentialLink, UserModalComponent},
  setup() {
    const version = process.env.VERSION_APPLI;
    const router = useRouter();
    const leftDrawerOpen = ref(false);
    const essentialLinks = ref(linksList);
    const essentialAdminLinks = ref(linksListAdmin);
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
      version,
      essentialLinks,
      essentialAdminLinks,
      userStore,
      userProfileModalVisible,
      leftDrawerOpen,
      logout,
      openUserProfileModal,
      toggleLeftDrawer,
      drawer: ref(false),
      miniState: ref(true)
    };
  },
});
