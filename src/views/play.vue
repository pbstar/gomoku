<template>
  <div class="play">
    <GomokuBoard />
  </div>
</template>
<script setup>
import GomokuBoard from "../components/GomokuBoard.vue";
</script>
<style>
.play {
  min-height: 100vh;
  display: flex;
  align-items: center;
}
</style>
