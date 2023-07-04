import {computed, defineComponent, PropType, ref} from 'vue';
import {IDispatchDto, IRangDto, IUserDto} from "src/common/dtos";
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
    const dispatch = ref<string>(props.user.dispatch.label);
    const rang = ref<string>(props.user.rang.label);

    function logout() {
      emit('logout');
    }

    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      dispatch,
      rang,
      logout,
    }
  },
});
