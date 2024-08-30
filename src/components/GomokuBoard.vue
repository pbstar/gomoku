<template>
  <div class="board">
    <div v-for="(item, index) in board" :key="index" class="board-box" @click="placePiece(index)">
      <span v-show="item === '1'" class="piece" style="background-color: #000;"></span>
      <span v-show="item === '2'" class="piece" style="background-color: #fff;"></span>
      <i class="current" v-show="currentPiece === index"></i>
      <i v-show="index >= boardSize" class="line1"></i>
      <i v-show="index % boardSize !== boardSize - 1" class="line2"></i>
      <i v-show="index < boardSize * (boardSize - 1)" class="line3"></i>
      <i v-show="index % boardSize !== 0" class="line4"></i>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const boardSize = ref(15);
const boardNum = ref(boardSize.value * boardSize.value);
const board = ref([]);
for (let i = 0; i < boardNum.value; i++) {
  board.value.push('');
}

const currentPiece = ref('');
const currentPlayer = ref('1');
const win = ref(false);

function placePiece(index) {
  if (win.value) {
    alert('Game over');
    return;
  }
  if (board.value[index] === '') {
    currentPiece.value = index
    board.value[index] = currentPlayer.value;

    if (checkWin()) {
      win.value = true;
      setTimeout(() => {
        alert('Player ' + currentPlayer.value + ' wins!');
      }, 100)
    } else {
      currentPlayer.value = currentPlayer.value === '1' ? '2' : '1';
    }
  } else {
    alert('Invalid move');
  }
}
// 获取处理后的棋盘数组
function getProcessedBoard(type) {
  const processedBoard = [];
  if (type === '1') {
    //获取行数据
    for (let i = 0; i < boardSize.value; i++) {
      const row = [];
      for (let j = 0; j < boardSize.value; j++) {
        row.push(board.value[i * boardSize.value + j]);
      }
      processedBoard.push(row);
    }
  } else if (type === '2') {
    //获取列数据
    for (let i = 0; i < boardSize.value; i++) {
      const row = [];
      for (let j = 0; j < boardSize.value; j++) {
        row.push(board.value[j * boardSize.value + i]);
      }
      processedBoard.push(row);
    }
  } else if (type === '3') {
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
  } else if (type === '4') {
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
      if (row[j] === row[j - 1] && row[j] !== '') {
        count++;
      }
    }
    if (count >= 5) {
      win = true;
      break;
    }
  }
  return win;
}
// 检查是否有玩家获胜
function checkWin() {
  let win = false;
  // 检查行
  let processedBoard = getProcessedBoard('1');
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查列
  processedBoard = getProcessedBoard('2');
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查左上到右下的对角线
  processedBoard = getProcessedBoard('3');
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  // 检查右上到左下的对角线
  processedBoard = getProcessedBoard('4');
  win = checkWinInProcessedBoard(processedBoard);
  if (win) return true;
  return win;
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

.current {
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

.line1,
.line2,
.line3,
.line4 {
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