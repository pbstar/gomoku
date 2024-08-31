<template>
  <div class="play">
    <h1>
      <span v-show="!winPlayer">Play</span>
      <span v-show="winPlayer">
        {{ winPlayer == 1 ? "黑棋" : "白棋" }} 获胜!
      </span>
    </h1>

    <GomokuBoard ref="GomokuBoardDom" @win="winFun" />
    <div class="btns">
      <button @click="resetBoard">重新开始</button>
      <button @click="undo">悔棋</button>
      <button @click="goback">返回</button>
    </div>
  </div>
</template>
<script setup>
import GomokuBoard from "../components/GomokuBoard.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const GomokuBoardDom = ref(null);
const winPlayer = ref("");

const winFun = (player) => {
  winPlayer.value = player;
};

const resetBoard = () => {
  GomokuBoardDom.value.resetBoard();
  winPlayer.value = "";
};

const undo = () => {
  GomokuBoardDom.value.undo();
};

const goback = () => {
  router.push("/");
};
</script>
<style>
.play {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
h1 {
  margin-bottom: 20px;
}

.btns {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
