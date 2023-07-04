<template>
  <q-page class="row items-center justify-evenly">
    INDEX PAGE
    <q-btn
    label="Go To Login"
    to="login"
    >
    </q-btn>

    <q-btn
    label="Ouvrir la palette"
    @click="openPalette = !openPalette"
    >
    </q-btn>

    <div>
      <InAndOutStock />
    </div>

  </q-page>
</template>
<script lang="ts" src="./IndexPage.ts"></script>
