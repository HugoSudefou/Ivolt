import {defineComponent, onMounted, ref} from 'vue'
import {useUserStore} from "stores/user";
import {userService} from "boot/iv-api";
import {IUserDto} from "src/common/dtos";

export default defineComponent({
  name: "InAndOutStock",
  setup() {
    const userStore = useUserStore();
    const users = ref<IUserDto[] | null>(null)
    async function getAllUser() {
      const wdAllUser = await userService.getAllUser();
      if(wdAllUser.isOk && wdAllUser.data) {
        users.value = wdAllUser.data;
      }
    }

    onMounted(async ()=> {
      if(userStore.rang === 'Adjoint') {
        await getAllUser();
      }
      await getAllUser();
    })

    return {
      users
    }
  }
})
