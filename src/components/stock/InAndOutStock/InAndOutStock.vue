<template>
  <div v-for="user in users" :key="user.usernameDiscord">
    <q-separator />
    <div>
      <span>{{ user.usernameDiscord }}</span>
    </div>
    <div>
      <span>{{ user.firstName }}  {{ user.lastName }}</span>
    </div>
    <div>
      <span>phoneNumber : {{ user.phoneNumber }}</span>
      <br>
      <span>active : {{ user.active }}</span>
    </div>
  </div>
</template>

<script lang="ts" src="./InAndOutStock.ts"></script>

<style scoped lang="scss" src="./InAndOutStock.scss"></style>
