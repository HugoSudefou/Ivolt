<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated :class="{ 'dark-mode': isDarkMode }">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          I-Volt
        </q-toolbar-title>

        <div>
          <UserModalComponent :user="userStore.getState" @logout="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :dark="isDarkMode"
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" src="./MainLayout.ts"></script>
<style scoped lang="scss" src="./MainLayout.scss"></style>
