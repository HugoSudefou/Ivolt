<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    style="min-height: 60px;"
    :href="essentialLinks.link"
  >
    <q-item-section
      v-if="essentialLinks.icon"
      avatar
    >
      <q-icon :name="essentialLinks.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ essentialLinks.title }}</q-item-label>
      <q-item-label caption>{{ essentialLinks.caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts" src="./EssentialLinkComponent.ts">

</script>

<style scoped lang="scss" src="./EssentialLinkComponent.scss"></style>
