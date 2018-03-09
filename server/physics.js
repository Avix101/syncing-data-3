const jumpForce = {};
const gravity = -9.8;

const applyGravity = (dogeParam, callback) => {
  const doge = dogeParam;
  if (jumpForce[doge.hash] > 0) {
    jumpForce[doge.hash] += gravity / 50;
  } else {
    jumpForce[doge.hash] = 0;
  }

  if (doge.jump) {
    jumpForce[doge.hash] = -gravity * 2;
    doge.jump = false;
  }

  doge.destY -= (jumpForce[doge.hash] + gravity);

  if (doge.destY > 436) {
    doge.destY = 436;
  }

  callback();
};

module.exports = {
  applyGravity,
};
