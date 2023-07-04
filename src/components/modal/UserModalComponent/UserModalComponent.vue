<template>
  <div class="q-pa-md">
    <q-btn flat round dense :style="{ color: user.dispatch.color }" icon="person">
      <q-menu
        :dark="isDarkMode"
        transition-show="jump-down"
        transition-hide="jump-up"
      >
        <div>
          <div class="row items-center, q-pa-md">
            <div class="column q-pr-md">
              <div>
                <DarkModeComponent />
              </div>
              <div>
                Rang: {{ rang }}
              </div>
              <div>
                Dispatch: {{ dispatch }}
              </div>
            </div>

            <q-separator vertical inset class="q-mx-lg" />

            <div class="column items-center">
              <q-avatar size="72px">
                <img src="https://wiki.21jumpclick.fr/images/2/25/I-volt_logo.png">
              </q-avatar>

              <div class="q-mt-md q-mb-sm">{{ user.firstName }} {{ user.lastName }}</div>

              <q-btn
                color="primary"
                label="Logout"
                @click="logout"
                push
                size="sm"
                v-close-popup
              />
            </div>
          </div>

          <q-separator inset class="q-mx-lg" />

          <div class="row items-center, q-pa-md">
            <div class="q-pr-md">
              <div class="text-h6">Settings</div>
            </div>
          </div>
        </div>
      </q-menu>
    </q-btn>
  </div>
</template>

<script lang="ts" src="./UserModalComponent.ts"></script>
<style lang="scss" scoped src="./UserModalComponent.scss"></style>
