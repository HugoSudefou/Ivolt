import {defineComponent, onUnmounted, ref} from "vue";
import InAndOutStock from "components/stock/InAndOutStock/InAndOutStock.vue";
import {userService} from "boot/iv-api";
import {IUserDto} from "src/common/dtos";
import {useUserStore} from "stores/user";
import {convertUserToIUserDto} from "src/common/converters/firebase-dto-converters";

export default defineComponent({
  name: "IndexPage",
  components: {InAndOutStock},
  setup() {
    const openPalette = ref<boolean>(false)

    return {
      openPalette
    }
  }
})
