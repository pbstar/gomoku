<template>
  <div class="about">
    <GomokuBoard/>  
  </div>
</template>
<script setup>
import GomokuBoard from '../components/GomokuBoard.vue'; 
</script>
<style>
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
</style>
