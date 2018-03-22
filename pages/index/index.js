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
    species:  Object.getOwnPropertyNames(BOXES).length,      // 掉落方块种类数
    fraction: 0,      // 累计分数
    centerX: 0,
    random: 0,        // 正在掉落的方块组合代号
    start: false,
    activePoints: [], // 正在掉落的方块点组合
    lockedPoints: [],  // 已经固定的方块点集合
    speed: 100,
    turn: false
  },
  onLoad: function () {
    this.setCenterPoint();
  },
  createBox: function () {
    // 创建随机数 选择使用哪种方块组合
    return Math.ceil(Math.random() * (this.data.species - 1)) + 1;
  },
  // 开始掉落
  startDrop: function () {
    const { rows, lockedPoints, speed } = this.data;
    const random = 1;
    let y = 0;
    console.log('startDrop');
    this.timeCount = setInterval(() => {
      if (BOXES[random] && y < rows) {
        // 每掉落一格 重新计算点
        const activePoints = BOXES[random](this.data.centerX, y++);
        const isExist = this.checkCompliance(activePoints);

        if (isExist) {
          this.mergePoints();
        } else {
          this.setData({ activePoints, random });
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
      duration: 3000
    })
  },
  // 合并下落点 与 已锁定点
  mergePoints: function () {
    // 清除循环读点 
    clearInterval(this.timeCount);
    this.setData({
      lockedPoints: this.data.lockedPoints.concat(this.data.activePoints),
    }, () => {
      const newPoints = this.checkEliminate();
      console.log('newPoints', newPoints)
      this.setData({
        lockedPoints: newPoints
      }, () => {
        // 当掉落点高度 落满屏幕时  停止
        const isAllow = this.checkTopBoundary();
        if (isAllow) {
          this.setCenterPoint();
          this.startDrop();
        } else {
          this.stopGame();
        }
      })
    });
  },
  // 检查是否有可消除的行 进行消除
  checkEliminate: function () {
    const { rows, columns, lockedPoints, fraction } = this.data;
    let readyCol = []; // 待消除列数
    for (let i = 0; i < rows; i++) {
      if (lockedPoints.filter(k => k[1] === i).length == columns) {
        console.log('readyCol', i);
        readyCol.push(i)
      }
    }
    console.log('checkEliminate', readyCol)
    if (readyCol.length > 0) {
      // 除去消除行的点 todo
      let curPoints = lockedPoints.filter(l => !readyCol.some(r => r === l[1]));
      // 消除分数加上
      this.setData({
        fraction: fraction + curPoints.length
      });
      console.log('curPoints', curPoints)
      // 比要消除行数 y值小的都加
      return curPoints.map((c) => {
        console.log('c[1]---', c[1])
        console.log('add', readyCol, util.where(readyCol, c[1]))
        c[1] = c[1] + util.where(readyCol, c[1])
        console.log('c[1]+++', c[1])
        return c
      })
    } else {
      return lockedPoints
    }
  },
  // 点击开始 || 快速掉落
  dropDown: function () {
    const { random, centerX, rows } = this.data;
    if (!random) {
      // 第一次 开始掉落
      this.startDrop();
      this.setData({ start: true });
    } else {
      // 之后 就是直接掉落  TODO  最后一行未必是rows
      const activePoints = BOXES[random](centerX, rows);
      this.setData({ activePoints });
    }
  },
  // 旋转  逆时针
  turnRotate: function () {

  },
  // 左移  将centerX -1 todo 需要检查四个点中最左边的点x > 0 && lockedPoints中没有
  turnLeft: function () {
    const isAllow = this.checkLeftBoundary()
    if (isAllow && this.data.start && this.data.centerX > 0) {
      this.setData({
        centerX: this.data.centerX - 1
      });
    }
  },
  // 右移  将centerX + 1 todo 需要检查四个点中最右边的点x < columns && lockedPoints中没有
  turnRight: function () {
    const isAllow = this.checkRightBoundary()
    if (isAllow && this.data.start && this.data.centerX < (this.data.columns - 1)) {
      this.setData({
        centerX: this.data.centerX + 1
      });
    }
  },
  // 检查 当前掉落的点的左边界 是否合规
  checkLeftBoundary: function () {
    const minLeft = Math.min( ...this.data.activePoints.map(k => k[0]) )
    console.log('checkLeftBoundary', minLeft)
    return minLeft > 0
  },
  // 检查 当前掉落的点的右边界 是否合规
  checkRightBoundary: function () {
    const maxRight = Math.max( ...this.data.activePoints.map(k => k[0]) )
    console.log('checkRightBoundary', maxRight)
    // 坐标点包含0
    return maxRight < (this.data.columns - 1)
  },
  // 检查 当前掉落的点的上边界 是否合规
  checkTopBoundary: function () {
    const minTop = Math.min( ...this.data.activePoints.map(k => k[1]) )
    // console.log('checkTopBoundary', minTop)
    return minTop > 0
  },
  // 检查 activePoints中的点 是否被 locked
  checkCompliance: function (activePoints) {
    const { lockedPoints } = this.data;
    return activePoints.some(ap => lockedPoints.some(lp => ap[0] === lp[0] && ap[1] === lp[1] ))
  },
  setCenterPoint: function () {
    // 选取下落中心x轴坐标
    const isOdd = !!(this.data.columns % 2);
    if (isOdd) {
      // 若列数为奇数 
      this.setData({
        centerX: (this.data.columns + 1) / 2
      });
    } else {
      // 若列数为偶数 
      this.setData({
        centerX: this.data.columns / 2 - 1
      });
    }
  }
})
