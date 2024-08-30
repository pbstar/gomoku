<template>
  <div class="playAi">
    <GomokuBoard ai />
  </div>
</template>
<script setup>
import GomokuBoard from "../components/GomokuBoard.vue";
</script>
<style>
.playAi {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
