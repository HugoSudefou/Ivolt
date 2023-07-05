<template>
  <div class="color-picker">
    <div class="color-box">
      <q-btn no-caps :color="selectedColor"></q-btn>
    </div>
    <div class="color-palette">
      <div v-for="color in colors" :key="color" class="color-option">
        <q-btn
          no-caps
          class="full-height full-width"
          :color="color"
          @click="selectColor(color)"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ColorPaletteComponent.ts"></script>
<style lang="scss" src="./ColorPaletteComponent.scss"></style>
