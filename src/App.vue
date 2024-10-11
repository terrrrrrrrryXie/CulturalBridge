<template>
  <div>
    <MenuBar v-if="route.path.split('/')[1] !== 'api'" />
    <GenAIComp />
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import GenAIComp from "./components/AIComp/GenAIComp.vue";
import MenuBar from "./components/MenuBar.vue";

const route = useRoute()

</script>
