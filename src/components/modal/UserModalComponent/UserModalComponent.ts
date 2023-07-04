import {computed, defineComponent, PropType} from 'vue';
import {IUserDto} from "src/common/dtos";
import DarkModeComponent from "components/common/DarkModeComponent/DarkModeComponent.vue";
import {useDarkModeStore} from "stores/dark-mode";

export default defineComponent({
  name: 'UserModalComponent',
  components: {DarkModeComponent},
  props: {
    user: {
      type: Object as PropType<IUserDto>,
      required: true,
    }
  },
  emits: ['logout'],
  setup(props, {emit}) {
    const darkModeStore = useDarkModeStore();

    function logout() {
      emit('logout');
    }

    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      logout,
    }
  },
});
