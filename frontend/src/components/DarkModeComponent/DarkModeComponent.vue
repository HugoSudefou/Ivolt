<template>
    <q-toggle
      class="absolute-right"
      label="Dark theme"
      v-model="darkMode"
      :options="[{ label: 'Sombre', value: false }, { label: 'Clair', value: true }]"
      @update:model-value="toggleDarkMode"
      flat
      dense
    />
</template>

<script lang="ts" src="./DarkModeComponent.ts"></script>
<style lang="scss" src="./DarkModeComponent.scss"></style>
