<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="home">
    <h1>五子棋</h1>
    <p>
      游戏规则：黑白两方轮流下子，先连成五个子的一方获胜。
    </p>
    <RouterLink to="/play">
      <button>开始游戏</button>
    </RouterLink>
    <RouterLink to="/playAi">
      <button>人机对决</button>
    </RouterLink>
  </div>
</template>
<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

}
h1 {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}
p {
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
}

button {
  margin-top: 20px;
}
</style>
