<template>
  <q-form class="contact-form q-gutter-y-xs" @submit="onSubmit">
    <q-select
      :dark="isDarkMode"
      v-model="formTransactionStock.action"
      :options="optionAction"
      option-value="value"
      option-label="label"
      :error="isSubmitClicked && isErrorAction"
      error-message="Action invalide"
      label="Action"
      filled
    >
    </q-select>

    <q-input
      :dark="isDarkMode"
      v-model.number="formTransactionStock.nbBatterie"
      :error="isSubmitClicked && isErrorNbBatterie"
      error-message="Nombre de batterie invalide"
      outlined
      clearable
      filled
      label="Nombre de batteire"
      type="number"
    />

    <q-select
      :dark="isDarkMode"
      filled
      v-model="formTransactionStock.user"
      use-input
      input-debounce="0"
      label="Employe.e"
      clearable
      :error="isSubmitClicked && isErrorUser"
      error-message="Employe.e invalide"
      :options="formattedOptions"
      option-value="id"
      option-label="label"
      @filter="filterFn"
      behavior="menu"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-btn
      class="full-width q-mt-lg"
      label="Enregistrement d'un stock"
      :loading="isLoading"
      type="submit"
    />
  </q-form>
</template>

<script lang="ts" src="./InAndOutStock.ts"></script>

<style scoped lang="scss" src="./InAndOutStock.scss"></style>
