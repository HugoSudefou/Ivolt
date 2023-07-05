import { computed, defineComponent, inject, onMounted, ref } from 'vue';
import { getAuthorizationUrl } from 'src/services/apis/discord.service';
import { useDarkModeStore } from 'stores/dark-mode';

export default defineComponent({
  name: 'LoginPage',
  setup() {
    const authorizationUrl = getAuthorizationUrl();
    const loginWithDiscord = async () => {
      window.location.href = authorizationUrl;
    };

    return {
      authorizationUrl,
      loginWithDiscord,
    };
  },
});
