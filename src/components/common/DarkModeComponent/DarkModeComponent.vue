<template>
  <q-toggle
    :label="darkMode ? 'Dark theme' : 'Light theme'"
    v-model="darkMode"
    :options="[
      { label: 'Sombre', value: false },
      { label: 'Clair', value: true },
    ]"
    @update:model-value="toggleDarkMode"
  />
</template>

<script lang="ts" src="./DarkModeComponent.ts"></script>
<style lang="scss" src="./DarkModeComponent.scss"></style>
