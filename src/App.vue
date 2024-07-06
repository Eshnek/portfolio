<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import TopBar from "./components/TopBar.vue";
</script>

<template>
  <header>
    <TopBar />
  </header>

  <RouterView />
</template>
