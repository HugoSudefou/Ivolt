<template>
  <!-- ancien lHh Lpr lFf-->
  <!-- nouveau hHh Lpr lff-->
  <q-layout view="hHh Lpr lff" container style="height: 100vh">
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
          I-Volt <sub style="font-size: small">{{ version }}</sub>
        </q-toolbar-title>

        <div>
          <UserModalComponent :user="userStore.getState" @logout="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <!--    <q-drawer
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
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

      </q-list>
    </q-drawer>-->

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      overlay
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      mini-to-overlay
      bordered
      :dark="isDarkMode"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list padding>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            :essentialLinks="link"
          />

          <q-separator />

          <EssentialLink
            v-for="link in essentialAdminLinks"
            :key="link.title"
            :essentialLinks="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" src="./MainLayout.ts"></script>
<style scoped lang="scss" src="./MainLayout.scss"></style>
