
// 几种方块组合
const BOXES = {
  // 正方形
  1: {
    // top
    0: (x, y)  => {
      return [[x, y - 1], [x + 1, y - 1], [x, y], [x + 1, y]];
    },
    // right
    1: (x, y)  => {
      return [[x, y - 1], [x + 1, y - 1], [x, y], [x + 1, y]];
    },
    // bottom
    2: (x, y)  => {
      return [[x, y - 1], [x + 1, y - 1], [x, y], [x + 1, y]];
    },
    // left
    3: (x, y)  => {
      return [[x, y - 1], [x + 1, y - 1], [x, y], [x + 1, y]];
    },
  },
  // 长方形
  2: {
    // top
    0: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x + 2, y]];
    },
    // right
    1: (x, y)  => {
      return [[x, y - 1], [x, y], [x, y + 1], [x, y + 2]];
    },
    // bottom
    2: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x + 2, y]];
    },
    // left
    3: (x, y)  => {
      return [[x, y - 1], [x, y], [x, y + 1], [x, y + 2]];
    }
  },
  // 3+1 形 1在左边
  3: {
    // top
    0: (x, y)  => {
      return [[x - 1, y], [x, y], [x - 1, y - 1], [x + 1, y]];
    },
    // right
    1: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x + 1, y - 1]];
    },
    // bottom
    2: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x + 1, y + 1]];
    },
    // left
    3: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x - 1, y + 1]];
    }
  },
  // 3+1 形  1在中间
  4: {
    // top
    0: (x, y)  => {
      return [[x - 1, y], [x, y], [x, y - 1], [x + 1, y]];
    },
    // right
    1: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x + 1, y]];
    },
    // bottom
    2: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x , y + 1]];
    },
    // left
    3: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x - 1, y]];
    }
  },
  // 3+1 形 1在右边
  5: {
    // top
    0: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x + 1, y - 1]];
    },
    // right
    1: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x + 1, y + 1]];
    },
    // bottom
    2: (x, y)  => {
      return [[x - 1, y], [x, y], [x + 1, y], [x - 1 , y + 1]];
    },
    // left
    3: (x, y)  => {
      return [[x, y + 1], [x, y], [x, y - 1], [x - 1, y - 1]];
    }
  },
  // 2+2 形  左高
  6: {
    // top
    0: (x, y)  => {
      return [[x, y], [x + 1, y ], [x, y - 1], [x - 1, y - 1]];
    },
    // right
    1: (x, y)  => {
      return [[x, y], [x, y + 1], [x + 1, y], [x + 1, y - 1]];
    },
    // bottom
    2: (x, y)  => {
      return [[x, y], [x + 1, y ], [x, y - 1], [x - 1, y - 1]];
    },
    // left
    3: (x, y)  => {
      return [[x, y], [x, y + 1], [x + 1, y], [x + 1, y - 1]];
    }
  },
  // 2+2 形  右高
  7: {
    // top
    0: (x, y)  => {
      return [[x, y], [x - 1, y], [x , y - 1], [x + 1, y - 1]];
    },
    // right
    1: (x, y)  => {
      return [[x, y], [x, y - 1], [x + 1, y], [x + 1, y + 1]];
    },
    // bottom
    2: (x, y)  => {
      return [[x, y], [x - 1, y], [x , y - 1], [x + 1, y - 1]];
    },
    // left
    3: (x, y)  => {
      return [[x, y], [x, y - 1], [x + 1, y], [x + 1, y + 1]];
    }
  },
};

module.exports = {
  BOXES,
};