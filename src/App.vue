<template>
  <div :class="{ 'dark-mode': isDarkMode }">
    <!-- Votre contenu -->
    <router-view />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useDarkModeStore } from 'stores/dark-mode';
export default {
  setup() {
    const darkModeStore = useDarkModeStore();
    return {
      isDarkMode: computed(() => darkModeStore.isDarkMode),
    };
  },
};
</script>
<style lang="scss">
.dark-mode {
  background-color: $dark !important;
  color: $jaune-ivolt !important;

  .q-field--dark .q-field__native,
  .q-field--dark .q-field__prefix,
  .q-field--dark .q-field__suffix,
  .q-field--dark .q-field__input {
    color: $jaune-ivolt !important;
  }
}
</style>
