<template>
  <div>
    <MenuBar />
    <GenAIComp />
    <router-view />
  </div>
</template>

<script setup>
import GenAIComp from "./components/AIComp/GenAIComp.vue";
import MenuBar from "./components/MenuBar.vue";
</script>
