import { boot } from 'quasar/wrappers';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { createPinia } from 'pinia';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useSpinnerStore } from 'stores/spinner';
import {ApiService} from "src/services/apis/api.service";
import {SessionStorageService} from "src/services/common/session-storage.service";
import {UserService} from "src/services/apis/user.service";
import {useUserStore} from "stores/user";
import {useDarkModeStore} from "stores/dark-mode";

let axiosInstance: AxiosInstance;
let apiService: ApiService;
let firebaseDatabase: Firestore;
let firebaseApp: FirebaseApp;

let sessionStorageService: SessionStorageService
let userService: UserService;

const firebaseConfig = {
  apiKey: process.env.YOUR_API_KEY,
  authDomain: process.env.YOUR_AUTH_DOMAIN,
  projectId: process.env.YOUR_PROJECT_ID,
  storageBucket: process.env.YOUR_STORAGE_BUCKET,
  messagingSenderId: process.env.YOUR_MESSAGING_SENDER_ID,
  appId: process.env.YOUR_APP_ID,
};

const initAxiosInstance = () => {
  // Create axios instance
  axiosInstance = axios.create();

  const spinner = useSpinnerStore();

  // Request interceptor
  axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    spinner.incrementPendingRequests();
    return config;
  });

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      spinner.decrementPendingRequests();
      return response;
    },
    (error: AxiosError) => {
      spinner.decrementPendingRequests();
      return Promise.reject(error);
    },
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default boot(({ app, store }) => {
  SessionStorageService.initNewTabStorage()
  // Applies pinia store on app now because initAxiosInstance needs it
  app.use(createPinia()); // à priori il faut initialiser Pinia avant de pouvoir l'utiliser https://github.com/vuejs/pinia/discussions/553#discussion-3430247

  const userStore = useUserStore()
  userStore.updateFromLocalStorage()
  const darkModeStore = useDarkModeStore();
  darkModeStore.updateFromLocalStorage()
  app.use(store);

  // Initialize the axiosApi instance that will be used by all the API services
  initAxiosInstance();

  // Inject the services

  firebaseApp = initializeApp(firebaseConfig);

  // used for the firestore refs
  firebaseDatabase = getFirestore(firebaseApp);

  sessionStorageService = new SessionStorageService()
  userService = new UserService();
  apiService = new ApiService(axiosInstance);
});

export { firebaseApp, firebaseDatabase, apiService, sessionStorageService, userService };
