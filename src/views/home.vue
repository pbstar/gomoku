<template>
  <div class="game-home">
    <div class="game-title">五子棋</div>

    <p class="game-desc">
      游戏规则：黑白两方轮流下子，先连成五个子的一方获胜。
    </p>

    <div class="game-play">
      <RouterLink to="/play">
        <button>开始游戏</button>
      </RouterLink>
      <RouterLink to="/playAi">
        <button>人机对决</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.game-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.game-title {
  font-size: 30px;
  text-align: center;
  margin-top: 50px;
}

.game-desc {
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.game-play {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
