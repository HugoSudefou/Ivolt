<template>
  <q-page-container>
    <q-page class="login-page q-pa-md">
      <q-card class="login-card text-center">
        <div class="q-pa-md">
          <div class="logo-container q-pa-lg q-mb-lg">
            <img
              :src="'https://wiki.21jumpclick.fr/images/2/25/I-volt_logo.png'"
              alt="I-Volt Logo"
              class="logo-image"
            />
          </div>
          <div class="text-h3 q-mb-md">Connexion</div>
          <div class="text-subtitle1 q-mb-lg">
            Connectez-vous avec Discord pour accéder à votre compte.
          </div>
          <q-btn
            color="primary"
            label="Se connecter avec Discord"
            class="q-mb-md"
            @click="loginWithDiscord"
          />
        </div>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script lang="ts" src="./LoginPage.ts"></script>
<style lang="scss" src="./LoginPage.scss"></style>
