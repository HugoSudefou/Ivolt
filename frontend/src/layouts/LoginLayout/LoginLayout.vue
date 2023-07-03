<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <DarkModeComponent/>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" src="./LoginLayout.ts"></script>
<style lang="scss" src="./LoginLayout.scss"></style>
