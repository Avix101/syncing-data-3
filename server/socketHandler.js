const xxh = require('xxhashjs');
const physics = require('./physics.js');

const doges = {};

let io;

const init = (ioInstance) => {
  io = ioInstance;

  io.on('connection', (sock) => {
    const socket = sock;

    socket.join('global-room');

    const time = new Date().getTime();
    const hash = xxh.h32(`${socket.id}${time}`, 0x01234567).toString(16);

    const randX = Math.floor(Math.random() * 400) + 40;

    doges[hash] = {
      hash,
      lastUpdate: time,
      x: randX,
      y: 0,
      prevX: randX,
      prevY: 0,
      destX: randX,
      destY: 0,
      ratio: 0,
      frame: 0,
      anim: 0,
      moveLeft: false,
      moveRight: false,
      jump: false,
    };

    socket.hash = hash;

    socket.emit('setDoge', doges[hash]);

    const dogeKeys = Object.keys(doges);
    for (let i = 0; i < dogeKeys.length; i++) {
      socket.emit('updateDoge', doges[dogeKeys[i]]);
    }

    socket.on('dogeMovement', (data) => {
      doges[socket.hash] = data;
      doges[socket.hash].lastUpdate = new Date().getTime();

      const callback = () => {
        io.sockets.in('global-room').emit('updateDoge', doges[socket.hash]);
      };

      physics.applyGravity(doges[socket.hash], callback);
    });

    socket.on('disconnect', () => {
      io.sockets.in('global-room').emit('deleteDoge', doges[socket.hash]);
      delete doges[socket.hash];
      socket.leave('global-room');
    });
  });
};

module.exports = {
  init,
};
