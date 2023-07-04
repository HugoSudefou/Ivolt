<template>
  <div class="redirection-page">
    <div class="loader">
      <Loader v-if="true" />
      <div class="loader-text">{{ textToDisplay }}</div>
    </div>
  </div>
</template>

<script lang="ts" src="./RedirectUrl.ts"></script>
<style lang="scss" src="./RedirectUrl.scss"></style>
