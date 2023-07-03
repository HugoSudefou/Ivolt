import {defineComponent, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {exchangeCodeForToken, getUserGuilds, isUserHasRoleIVolt} from 'src/services/apis/discord.service';
import {sessionStorageService, userService} from "boot/iv-api";
import {useUserStore} from "stores/user";
import {displayNotification} from "src/services/common/notification.service";
import {NotificationStatusEnum} from "src/common/enums";
import Loader from "components/LoaderComponent/LoaderComponent.vue";

export default defineComponent({
  name: 'RedirectUrl',
  components: {Loader},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const textToDisplay = ref<string>('Redirection en cours...');

    async function getTokenFromCode(code: string) {
      const wdToken = await exchangeCodeForToken(code);
      if (wdToken.isOk && wdToken.data) {
        textToDisplay.value = 'Oh on viens de récupérer ton token';
        const wdGuild = await getUserGuilds(wdToken.data?.access_token);
        if (wdGuild.isOk && wdGuild.data) {
          textToDisplay.value = 'Oh on viens de récupérer le discord, on vérifie que tu ai bien les droits';
          if (isUserHasRoleIVolt(wdGuild.data)) {
            if (wdGuild.data.user && wdGuild.data.user.username) {
              let firstName = '';
              let lastName = '';
              if (wdGuild.data.nick) {
                const splitNickNameDiscord = wdGuild.data.nick.split(' ');
                firstName = splitNickNameDiscord[0];
                lastName = splitNickNameDiscord[1];
              }
              const wdUser = await userService.getOrCreateUserByUsernameDiscord(wdGuild.data.user.username + '1', wdGuild.data.user.avatar, firstName, lastName, wdToken.data.refresh_token)
              if (wdUser.isOk && wdUser.data) {
                if (wdUser.successMessage) {
                  displayNotification(NotificationStatusEnum.SUCCESS, wdUser.successMessage)
                }
                sessionStorageService.setIvUserData(wdUser.data);
                userStore.setUser(wdUser.data);
                router.push('/')
                return;
              }
            }
          }
        }
      }
      router.push('/login')
    }

    onMounted(async () => {
      const code = route.query.code;
      if (code) {
        await getTokenFromCode(code.toString());
      } else {
        const error = route.query.error;
        if (error) {
          router.push('/login')
        }
      }
    });
    return {
      textToDisplay
    };
  },
});
