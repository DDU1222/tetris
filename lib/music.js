const musicAction = {
  start: {
    startTime: 3.7202,
    duration: 3.6224
  },
  clear: {
    startTime: 0,
    duration: 0.7675
  },
  drop: {
    startTime: 1.2558,
    duration: 0.3546
  },
  gameover: {
    startTime: 8.1276,
    duration: 1.1437
  }, 
  rotate: {
    startTime: 2.2471,
    duration: 0.0807
  },
  move: {
    startTime: 2.9088,
    duration: 0.1437
  }
}

let music = {};

(() => {
  const innerAudioContext = wx.createInnerAudioContext();
  innerAudioContext.autoplay = false;
  innerAudioContext.src = 'http://7xvnyd.com1.z0.glb.clouddn.com/music.mp3';
  innerAudioContext.volume = 1;
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  });
  innerAudioContext.onError((res) => {
    console.log('error', res.errMsg, res.errCode)
  });

  Object.keys(musicAction).forEach((action) => {
    music[action] = () => {
      console.log('action', action, innerAudioContext);
      innerAudioContext.startTime = musicAction[action].startTime;
      innerAudioContext.play();
      const counter = setTimeout(() => {
        innerAudioContext.stop();
        clearTimeout(counter);
      }, musicAction[action].duration * 1000);
    }
  });

})();


module.exports = music;


