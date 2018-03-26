const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function compare(a, b) {
	if (a < b) {
		return -1;
	} else if (a > b) {
		return 1;
	} else {
		return 0;
	}
}
function where (arr, num) {
  let newArr = arr.slice(0);
	newArr.push(num);
	newArr.sort(compare);
	return newArr.length - newArr.indexOf(num) - 1;
}

// 创建随机数  1~range
function createRandom (range) {
  // 创建随机数 选择使用哪种方块组合
  return Math.ceil(Math.random() * range);
}

module.exports = {
  formatTime,
  where,
  createRandom
};
