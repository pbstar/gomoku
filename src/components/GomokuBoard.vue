<template>
  <div class="board" @mouseout.self="currentHover = -1">
    <div
      v-for="(item, index) in board"
      :key="index"
      class="board-box"
      :class="{ hover: currentHover === index }"
      @click="placePiece(index)"
      @mouseenter="currentHover = index"
    >
      <span
        v-show="item === '1'"
        class="piece"
        style="background-color: #000"
      />
      <span
        v-show="item === '2'"
        class="piece"
        style="background-color: #fff"
      />
      <i class="current-piece" v-show="currentPiece === index" />
      <i v-show="index >= boardSize" class="line line1" />
      <i v-show="index % boardSize !== boardSize - 1" class="line line2" />
      <i v-show="index < boardSize * (boardSize - 1)" class="line line3" />
      <i v-show="index % boardSize !== 0" class="line line4" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  ai: {
    type: Boolean,
  },
});
const emit = defineEmits(["win"]);

// 抛出refs方法
defineExpose({
  resetBoard,
  undo,
});

const currentHover = ref(-1);

const boardSize = ref(15);
const boardNum = ref(boardSize.value * boardSize.value);
const board = ref(Array.from({ length: boardNum.value }, () => ""));

const currentPiece = ref("");
const lastCurrentPiece = ref("");

const currentPlayer = ref("1");
const win = ref(false);
const aiLoading = ref(false);

function findBestMove() {
  // 这里可以实现一个简单的AI算法来找到最佳棋步
  // 示例中使用一个随机数生成器来模拟AI决策 - TODO:需要改为更好的落子点
  const emptyCells = board.value.reduce((acc, cell, index) => {
    if (cell === "") acc.push(index);
    return acc;
  }, []);

  if (emptyCells.length === 0) return -1; // 棋盘已满，无法下棋

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}

function placePiece(index, byAi) {
  if (win.value) {
    alert("Game over");
    return;
  }
  if (aiLoading.value && !byAi) {
    return;
  }

  if (board.value[index] === "") {
    lastCurrentPiece.value = currentPiece.value;
    currentPiece.value = index;
    board.value[index] = currentPlayer.value;

    if (checkWin()) {
      win.value = true;
      emit("win", currentPlayer.value);
      setTimeout(() => {
        alert("Player " + currentPlayer.value + " wins!");
      }, 100);
      return;
    } else {
      currentPlayer.value = currentPlayer.value === "1" ? "2" : "1";
    }
    if (props.ai && !byAi) {
      aiLoading.value = true;
      setTimeout(() => {
        const aiMove = findBestMove();
        if (aiMove !== -1) {
          placePiece(aiMove, true);
        }
        aiLoading.value = false;
      }, 1000);
    }
  } else {
    alert("Invalid move");
  }
}
// 获取处理后的棋盘数组
function getProcessedBoard(type) {
  const processedBoard = [];
  if (type === "1") {
    //获取行数据
    for (let i = 0; i < boardSize.value; i++) {
      const row = [];
      for (let j = 0; j < boardSize.value; j++) {
        row.push(board.value[i * boardSize.value + j]);
      }
      processedBoard.push(row);
    }
  } else if (type === "2") {
    //获取列数据
    for (let i = 0; i < boardSize.value; i++) {
      const row = [];
      for (let j = 0; j < boardSize.value; j++) {
        row.push(board.value[j * boardSize.value + i]);
      }
      processedBoard.push(row);
    }
  } else if (type === "3") {
    //获取左上到右下的对角线数据
    let rowNum = 2 * boardSize.value - 1;
    for (let i = 0; i < rowNum; i++) {
      const row = [];
      for (let j = 0; j <= i; j++) {
        const x = i - j;
        const y = j;
        if (x >= 0 && x < boardSize.value && y >= 0 && y < boardSize.value) {
          row.push(board.value[x * boardSize.value + y]);
        }
      }
      processedBoard.push(row);
    }
  } else if (type === "4") {
    //获取左下到右上的对角线数据
    let rowNum = 2 * boardSize.value - 1;
    for (let i = 0; i < rowNum; i++) {
      const row = [];
      for (let j = 0; j <= i; j++) {
        const x = boardSize.value - 1 - j;
        const y = i - j;
        if (x >= 0 && x < boardSize.value && y >= 0 && y < boardSize.value) {
          row.push(board.value[x * boardSize.value + y]);
        }
      }
      processedBoard.push(row);
    }
  }
  return processedBoard;
}
// 检查处理后的棋盘数组中是否有玩家获胜
function checkWinInProcessedBoard(processedBoard) {
  let win = false;
  for (let i = 0; i < processedBoard.length; i++) {
    const row = processedBoard[i];
    let count = 1;
    for (let j = 1; j < row.length; j++) {
      if (row[j] === row[j - 1] && row[j] !== "") {
        count++;
      } else {
        count = 1;
      }
      if (count >= 5) {
        win = true;
        return win;
      }
    }
  }
  return win;
}
// 检查是否有玩家获胜
function checkWin() {
  let win = false;
  // 检查行
  let processedBoard = getProcessedBoard("1");
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查列
  processedBoard = getProcessedBoard("2");
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查左上到右下的对角线
  processedBoard = getProcessedBoard("3");
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查右上到左下的对角线
  processedBoard = getProcessedBoard("4");
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  return win;
}

// 重置棋盘
function resetBoard() {
  board.value = Array.from({ length: boardNum.value }).fill("");
  currentPiece.value = "";
  currentPlayer.value = "1";
  win.value = false;
}

// 悔棋
function undo() {
  if (currentPiece.value === "") {
    alert("No moves to undo");
    return;
  }
  board.value[currentPiece.value] = "";
  currentPiece.value = lastCurrentPiece.value;
  currentPlayer.value = currentPlayer.value === "1" ? "2" : "1";
}
</script>

<style scoped>
.board {
  background-color: #f7bd67;
  display: flex;
  flex-wrap: wrap;
  width: 450px;
  height: 450px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  box-sizing: content-box;
}

.board-box {
  width: 30px;
  height: 30px;
  position: relative;
  cursor: pointer;
}

.hover {
  .line {
    background-color: #f00;
  }
}

.piece {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: background-color 0.3s ease;
  z-index: 10;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.current-piece {
  display: block;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #2bd82b7e;
  z-index: 5;
}

.line {
  position: absolute;
  background-color: #00000085;
  transition: opacity 0.3s ease;
}

.line1 {
  width: 2px;
  height: 50%;
  top: 0;
  left: 50%;
  margin-top: 1px;
  margin-left: -1px;
}

.line2 {
  width: 50%;
  height: 2px;
  top: 50%;
  left: 50%;
  margin-top: -1px;
  margin-left: -1px;
}

.line3 {
  width: 2px;
  height: 50%;
  top: 50%;
  left: 50%;
  margin-top: -1px;
  margin-left: -1px;
}

.line4 {
  width: 50%;
  height: 2px;
  top: 50%;
  left: 0;
  margin-top: -1px;
  margin-left: 1px;
}
</style>
