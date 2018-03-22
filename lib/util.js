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
	arr.push(num);
	arr.sort(compare);
	return arr.length - arr.indexOf(num) - 1;
}

module.exports = {
  formatTime: formatTime,
  where,
};
