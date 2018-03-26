//index.js
const CONFIG = require('../../lib/config.js');
const util = require('../../lib/util.js');

const { BOXES } = CONFIG;
//获取应用实例
const app = getApp();

Page({
  data: {
    rows:     20,     // 方块行数
    columns:  10,     // 方块列数
    fraction: 0,      // 累计分数
    centerX: 0,
    y: 0,
    random: 0,        // 正在掉落的方块组合代号
    start: false,
    activePoints: [], // 正在掉落的方块点组合
    lockedPoints: [],  // 已经固定的方块点集合
    speed: 500,
    direction: 0, // 默认是top
    readyCols: [],
    blinkingCols: [],
    blinkingCount: 2
  },
  onLoad: function () {
    // this.start();
  },
  createRandom: function () {
    // 创建随机数 选择使用哪种方块组合
    this.setData({ random: util.createRandom(Object.getOwnPropertyNames(BOXES).length) });
  },
  // 初始设置
  start: function () {
    const { speed } = this.data;
    this.setData({ start: true }, () => {
      this.createRandom();
      this.setStartLocation();
      this.autoDrop(speed);
    });
  },
  // 开始掉落
  autoDrop: function (speed) {
    const { rows, lockedPoints, random } = this.data;
    clearInterval(this.timeCount);
    this.timeCount = setInterval(() => {
      if (BOXES[random] && this.data.y < rows) {
        // 每掉落一格 重新计算点
        let activePoints = BOXES[random][this.data.direction](this.data.centerX, this.data.y);
        const isExist = this.checkCompliance(activePoints);
        if (isExist) {
          this.mergePoints();
        } else {
          this.setData({ activePoints, y: this.data.y + 1, turn: false });
        }
      } else {
        this.mergePoints();
      }
    }, speed);
  },
  // 游戏结束
  stopGame: function () {
    // 清除循环读点 
    clearInterval(this.timeCount);
    wx.showToast({
      title: '游戏结束！',
      icon: 'none',
      duration: 3000,
      success: () => {
        this.setData({
          lockedPoints: [],
          activePoints: [],
          start: false
        })
      }
    })
  },
  // 游戏暂停 开始
  pause: function () {
    const { start, lockedPoints, speed } = this.data;
    if (!start) {
      // 第一次 开始掉落
      this.setData({ start: true }, () => {
        this.autoDrop(speed);
      });
    } else {
      clearInterval(this.timeCount);
      this.setData({ start: false });
    }
  },
  // 重新开始
  restart: function () {
    // 第一次 开始掉落
    this.setData({
      fraction: 0,      // 累计分数
      centerX: 0,
      y: 0,
      random: 0,
      start: true,
      activePoints: [], // 正在掉落的方块点组合
      lockedPoints: [],  // 已经固定的方块点集合
      direction: 0, // 默认是top
      readyCols: [],
      blinkingCols: [],
      }, () => {
      this.autoDrop(this.data.speed);
    });
  },
  // 合并下落点 与 已锁定点
  mergePoints: function () {
    const { speed } = this.data;
    // 清除循环读点 
    clearInterval(this.timeCount);
    this.setData({
      lockedPoints: this.data.lockedPoints.concat(this.data.activePoints),
    }, () => {
      const newPoints = this.clearLines();
      if (this.data.readyCols.length) {
        console.log('有需要消除的行', newPoints);
        this.blinking().then(() => {
          this.setData({
            lockedPoints: newPoints,
            activePoints: [],
            readyCols: []
          }, () => {
            this.ready();
          });
        })
      } else {
        this.ready();
      }
    });
  },
  blinking: function () {
    return new Promise((resolve, reject) => {
      let count = 0;
      this.blinkingFn = setInterval(() => {
        if (count < this.data.blinkingCount * 2) {
          count += 1;
          this.setData({
            blinkingCols: count % 2 ? this.data.readyCols : []
          });
        } else {
          clearInterval(this.blinkingFn);
          resolve()
        }
      }, 300);
    });
  },
  ready: function () {
    // 当掉落点高度 落满屏幕时  停止
    const isAllow = this.checkTopBoundary();
    if (isAllow) {
      // 一个方块结束, 触发下一个
      this.start();
    } else {
      this.stopGame();
    }
  },
  // 检查是否有可消除的行 进行消除
  clearLines: function () {
    const { rows, columns, lockedPoints, fraction } = this.data;
    
    let newPoints = []
    let readyCols = []
    for (let i = 0; i < rows; i++) {
      let rowPoints = lockedPoints.filter(k => k[1] === i);
      if (rowPoints.length === columns) {
        readyCols.push(i)
      } else {
        newPoints = newPoints.concat(rowPoints);
      }
    }
    if (readyCols.length > 0) {
      this.setData({
        fraction: fraction + readyCols.length,
        readyCols
      });
      //  比要消除行数 y值小的都加
      return newPoints.map((c) => {
        const newReadyCols = readyCols;
        c[1] = c[1] + util.where(newReadyCols, c[1])
        return c
      })
    } else {
      return lockedPoints;
    }
  },
  // 点击开始 || 快速掉落
  turnDown: function () {
    const { start } = this.data;
    if (!start) return;
    // 之后 就是直接掉落  TODO  最后一行未必是rows
    this.autoDrop(5);
  },
  // 旋转  顺时针
  turnRotate: function () {
    const { start, turn, direction } = this.data;
    if (!start) return;
    const isAllow = this.checkRotateBoundary();
    if (isAllow) {
      this.setData({
        direction: direction === 3 ? 0 : direction + 1
      });
    }
  },
  // 左移  将centerX -1 todo 需要检查四个点中最左边的点x > 0 && lockedPoints中没有
  turnLeft: function () {
    const { start, centerX, turn } = this.data;
    if (!start) return;
    const isAllow = this.checkLeftBoundary()
    if (isAllow) {
      this.setData({
        centerX: centerX - 1
      });
    }
  },
  // 右移  将centerX + 1 todo 需要检查四个点中最右边的点x < columns && lockedPoints中没有
  turnRight: function () {
    const { start, centerX, turn } = this.data;
    if (!start) return;
    const isAllow = this.checkRightBoundary()
    if (isAllow) {
      this.setData({
        centerX: centerX + 1
      });
    }
  },
  // 检查旋转后的点是否满足条件
  checkRotateBoundary: function () {
    const { direction, centerX, y, random } = this.data;
    const curPonits = BOXES[random][direction === 3 ? 0 : direction + 1](centerX, y);
    const isExist = this.checkCompliance(curPonits);
    return  !isExist && curPonits.every((point) => {
      return point[0] >= 0 && point[0] < this.data.columns
    });
  },
  // 检查 当前掉落的点的左边界 是否合规
  checkLeftBoundary: function () {
    const { direction, centerX, y, random } = this.data;
    const curPonits = BOXES[random][direction](centerX - 1, y);
    return  curPonits.every((point) => {
      return point[0] >= 0
    });
  },
  // 检查 当前掉落的点的右边界 是否合规
  checkRightBoundary: function () {
    const { direction, centerX, y, random } = this.data;
    const curPonits = BOXES[random][direction](centerX + 1, y);
    return curPonits.every((point) => {
      return point[0] < this.data.columns
    });
  },
  // 检查 当前掉落的点的上边界 是否合规
  checkTopBoundary: function () {
    return this.data.activePoints.every((point) => {
      return point[1] > 0
    });
  },
  // 检查 activePoints中的点 是否被 locked
  checkCompliance: function (activePoints) {
    const { lockedPoints, rows } = this.data;
    return activePoints.some(ap => lockedPoints.some(lp => ap[0] === lp[0] && ap[1] === lp[1] ) || ap[1] >= rows)
  },
  setStartLocation: function () {
    // 选取下落中心x轴坐标 若列数为奇数 若列数为偶数 
    const centerX = !!(this.data.columns % 2) ? (this.data.columns + 1) / 2 : this.data.columns / 2 - 1;
    this.setData({ centerX, y: 0, direction: 0 });
  }
})
