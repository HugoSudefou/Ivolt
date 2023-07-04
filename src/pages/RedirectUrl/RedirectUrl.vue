<template>
  <div :class="{ 'dark-mode': isDarkMode }" class="redirection-page">
    <div class="loader">
      <Loader v-if="true" />
      <div>{{ textToDisplay }}</div>
    </div>
  </div>
</template>

<script lang="ts" src="./RedirectUrl.ts"></script>
<style lang="scss" src="./RedirectUrl.scss"></style>
