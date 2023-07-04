import {defineComponent, PropType, ref} from "vue";
import {IEssentialLinkDtos} from "src/common/dtos";

export default defineComponent({
  name: 'EssentialLink',
  props: {
    essentialLinks: {
      type: Object as PropType<IEssentialLinkDtos>,
      required: true,
    }
  },
  setup () {

    return {
      test: ref(false)
    }
  }
});
