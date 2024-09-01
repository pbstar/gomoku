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

const moveHistory = ref([]); // 记录下棋历史
const currentPiece = ref("");

const currentPlayer = ref("1");
const win = ref(false);
const aiLoading = ref(false);

// 检查处理后的棋盘数组中AI的分数
function checkScoreInProcessedBoard(processedBoard, layerIdx, posIdx) {
  const layer = processedBoard[layerIdx];

  let score = 0;
  let localStatus = [];
  // 增加1格视野以考虑边缘情况
  for (let j = posIdx - 5; j <= posIdx + 5; j++) {
    if (j < 0 || j >= layer.length) {
      continue;
    } else {
      localStatus.push(layer[j]);
    }
  }

  // 胜利积分
  const preLayer = layer;
  preLayer[posIdx] = "2";
  if (checkWinInProcessedBoard(preLayer)) {
    score += 10000;
  }

  // 个数积分
  const aiPoint = localStatus.filter((item) => item === "2").length;
  const userPoint = localStatus.filter((item) => item === "1").length;
  score = aiPoint - 2 * userPoint;

  // 临近积分
  if (layer[posIdx - 1] === "2" || layer[posIdx + 1] === "2") {
    score += 2 * aiPoint;
  }

  if (layer[posIdx - 1] === "1" || layer[posIdx + 1] === "1") {
    score -= 4 * userPoint;
  }

  if (layer[posIdx - 2] === "2" || layer[posIdx + 2] === "2") {
    score += aiPoint;
  }

  if (layer[posIdx - 2] === "1" || layer[posIdx + 2] === "1") {
    score -= 2 * userPoint;
  }

  // 边界扣分
  if (posIdx <= 2 || posIdx >= layer.length - 2) {
    score -= 20;
  }

  // 防守加分
  if (userPoint >= 3 && aiPoint === 0) {
    score += 10;
    if (layer[posIdx - 1] == "1" || layer[posIdx + 1] == "1") {
      score += 8 * userPoint;
    }

    if (layer[posIdx - 2] == "1" || layer[posIdx + 2] == "1") {
      score += 4 * userPoint;
    }
  }

  return score;
}

// 处理index 转换为 layerIdx 和 posIdx
function layerIdxTrans(type, index) {
  if (type === "1") {
    return [Math.floor(index / boardSize.value), index % boardSize.value];
  } else if (type === "2") {
    return [index % boardSize.value, Math.floor(index / boardSize.value)];
  } else if (type === '3') {
    const x = Math.floor(index / boardSize.value)
    const y = index % boardSize.value

    return [x + y, Math.min(boardSize.value - 1 - x, y) ]
  }
}

function evaluateMove(index) {
  let scores = [
    checkScoreInProcessedBoard(
      getProcessedBoard("1"),
      ...layerIdxTrans("1", index)
    ),
    checkScoreInProcessedBoard(
      getProcessedBoard("2"),
      ...layerIdxTrans("2", index)
    ),
    checkScoreInProcessedBoard(
      getProcessedBoard("3"),
      ...layerIdxTrans("3", index)
    ),
    // checkScoreInProcessedBoard(getProcessedBoard("4")),
  ];

  let score = Math.max(...scores);

  if (score === 0) {
    score = Math.min(...scores);
  }

  return score;
}

function findBestMove() {
  let bestScore = -Infinity;
  let bestMoves = [];
  let bestMove = -1;

  for (let i = 0; i < boardSize.value * boardSize.value; i++) {
    if (board.value[i] === "") {
      let score = evaluateMove(i);
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      } else if (score === bestScore) {
        bestMoves.push(i);
      }
    }
  }

  bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

  return bestMove;
}

function placePiece(index, byAi) {
  if (win.value) {
    alert("Game over");
    return;
  }
  if (aiLoading.value && !byAi) {
    board.value[index] = currentPlayer.value;
    return;
  }
  if (board.value[index]) {
    return
  }
  currentPiece.value = index;
  board.value[index] = currentPlayer.value;
  moveHistory.value.push({ index, player: currentPlayer.value }); // 记录下棋步骤

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
    }, 100);
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
  moveHistory.value = []; // 重置下棋历史
  currentPiece.value = "";
  currentPlayer.value = "1";
  win.value = false;
}

// 悔棋
function undo() {
  if (moveHistory.value.length) {
    const lastMove = moveHistory.value.pop();
    board.value[lastMove.index] = "";

    currentPlayer.value = lastMove.player;
    win.value = false;

    const lastCurrentPiece = moveHistory.value.at(-1);
    currentPiece.value = lastCurrentPiece ? lastCurrentPiece.index : "";
  } else resetBoard();
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
