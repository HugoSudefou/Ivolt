import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue';
import { useUserStore } from 'stores/user';
import { stockService, userService } from 'boot/iv-api';
import { IUserDto } from 'src/common/dtos';
import { IFormTransactionStockDtos } from 'src/common/dtos/stock.dtos';
import {
  convertIFormTransactionStockDtosToITransactionStockDtos,
  convertUserToIUserDto,
} from 'src/common/converters/firebase-dto-converters';
import { ITypeActionStockEnum } from 'src/common/enums';
import { useDarkModeStore } from 'stores/dark-mode';
import { useSpinnerStore } from 'stores/spinner';

export default defineComponent({
  name: 'InAndOutStock',
  setup() {
    const darkModeStore = useDarkModeStore();
    const spinnerStore = useSpinnerStore();
    const userStore = useUserStore();
    const user = userStore.getState;
    const isSubmitClicked = ref<boolean>(false);
    const users = ref<IUserDto[] | null>(null);
    const options = ref<IUserDto[] | null>(null);
    const optionAction = ref<ITypeActionStockEnum[] | null>([
      ITypeActionStockEnum.ENTREE,
      ITypeActionStockEnum.SORTIE,
    ]);

    async function getAllUser() {
      const wdAllUser = await userService.getAllUser();
      if (wdAllUser.isOk && wdAllUser.data) {
        users.value = wdAllUser.data;
      }
    }

    function getUserForTransacStock() {
      const convertUser = convertUserToIUserDto(user);
      if (users.value) {
        if (userStore.rang.label === 'Directeur') {
          console.log('LE Directeur est la, le DIRECTEUR');
        } else {
          const userStock = convertUserToIUserDto(
            users.value.find((user) => user.firstName === 'STOCK ENTREPRISE'),
          );
          options.value = [convertUser, userStock];
          return;
        }
      }
      options.value = [convertUser];
    }

    const formTransactionStock = reactive<IFormTransactionStockDtos>({
      action: '',
      date: Date.now(),
      user: { label: 'Faut Choisir un utilisateur !!', id: '0' },
      nbBatterie: null,
    });

    //doc(firebaseDatabase, `/user/${userStore.id}`),
    async function onSubmit() {
      isSubmitClicked.value = true;
      if (isErrorAction.value || isErrorNbBatterie.value || isErrorUser.value)
        return;
      spinnerStore.incrementPendingRequests();
      const transactionStock =
        convertIFormTransactionStockDtosToITransactionStockDtos(
          formTransactionStock,
        );
      const wdAddTransacStock = await stockService.addTransactionStock(
        transactionStock,
      );
      spinnerStore.decrementPendingRequests();
    }

    const updateUsers = (data: IUserDto[]) => {
      users.value = data;
      getUserForTransacStock();
    };

    const isErrorAction = computed(() => {
      return !formTransactionStock.action || formTransactionStock.action === '';
    });

    const isErrorNbBatterie = computed(() => {
      return formTransactionStock.nbBatterie === null;
    });

    const isErrorUser = computed(() => {
      return (
        formTransactionStock.user === null ||
        formTransactionStock.user.id === '0'
      );
    });

    // Démarrer l'écoute en temps réel des utilisateurs
    const unsubscribe = userService.startListeningForUsers(updateUsers);

    // Arrêter l'écoute lors du démontage du composant
    onUnmounted(unsubscribe);

    onMounted(async () => {
      await getAllUser();
    });

    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
      isLoading: computed(() => spinnerStore.isLoading),
      options,
      users,
      formTransactionStock,
      optionAction,
      isSubmitClicked,
      isErrorAction,
      isErrorNbBatterie,
      isErrorUser,
      onSubmit,
      filterFn(val: any, update: any) {
        if (val === '') {
          update(() => {
            if (users.value) {
              options.value = users.value.map(convertUserToIUserDto);
            } else {
              options.value = [];
            }
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          if (users.value) {
            options.value = users.value.filter(
              (v) =>
                v.firstName.toLowerCase().indexOf(needle) > -1 ||
                v.lastName.toLowerCase().indexOf(needle) > -1,
            );
          }
        });
      },
      formattedOptions: computed(() =>
        options.value?.map((user: IUserDto) => ({
          id: user.id,
          label: `${user.firstName} ${user.lastName}`, // Concaténation des champs firstName et lastName
        })),
      ),
    };
  },
});
