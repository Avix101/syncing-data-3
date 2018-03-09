"use strict";

var spriteDimensions = {
	width: 64,
	height: 64
};

var animRows = {
	forward: 0,
	right: 1,
	left: 3,
	jump: 8
};

var lerp = function lerp(pos1, pos2, ratio) {
	var component1 = (1 - ratio) * pos1;
	var component2 = ratio * pos2;
	return component1 + component2;
};

var draw = function draw() {
	ctx.clearRect(0, 0, 500, 500);

	var dogeKeys = Object.keys(doges);

	for (var i = 0; i < dogeKeys.length; i++) {
		var doge = doges[dogeKeys[i]];

		if (doge.ratio < 1) {
			doge.ratio += 0.05;
		}

		ctx.save();

		if (doge.hash === hash) {
			ctx.filter = "brightness(1.5)";
		} else {
			ctx.filter = "none";
		}

		doge.x = lerp(doge.prevX, doge.destX, doge.ratio);
		doge.y = lerp(doge.prevY, doge.destY, doge.ratio);

		frameLimiter++;

		if (frameLimiter > frameLimit) {
			if (doge.moveLeft || doge.moveRight) {
				doge.frame = (doge.frame + 1) % 4;
			} else if (doge.y < 435) {
				doge.anim = animRows["jump"];
				doge.frame = (doge.frame + 1) % 3;
			} else {
				doge.anim = animRows["forward"];
				doge.frame = (doge.frame + 1) % 3;
			}

			frameLimiter = 0;
		}

		ctx.drawImage(dogeSprite, 32 * doge.frame, 32 * doge.anim, 32, 32, doge.x, doge.y, spriteDimensions.width, spriteDimensions.height);

		ctx.restore();
	}
};
"use strict";

var canvas = void 0,
    ctx = void 0,
    dogeSprite = void 0,
    animationFrame = void 0;
var socket = void 0,
    hash = void 0;
var doges = {};

//Limit advances in sprite frames (to avoid rapid animation)
var frameLimiter = 0;
var frameLimit = 10;

var keyDownEvent = function keyDownEvent(e) {
	var key = e.which;
	var doge = doges[hash];

	if (key === 65 || key === 37) {
		doge.moveLeft = true;
	} else if (key === 68 || key === 39) {
		doge.moveRight = true;
		//Spacebar for jumping
	} else if (key === 32 && doge.y >= canvas.height - spriteDimensions.height - 1) {
		doge.jump = true;
	}
};

var keyUpEvent = function keyUpEvent(e) {
	var key = e.which;
	var doge = doges[hash];

	if (key === 65 || key === 37) {
		doge.moveLeft = false;
	} else if (key === 68 || key === 39) {
		doge.moveRight = false;
	}
};

var init = function init() {
	canvas = document.querySelector("#viewport");
	ctx = canvas.getContext("2d");

	dogeSprite = document.querySelector("#dogeSprite");

	socket = io.connect();
	socket.on('setDoge', setDoge);
	socket.on('updateDoge', updateDoge);
	socket.on('deleteDoge', deleteDoge);

	document.body.addEventListener('keydown', keyDownEvent);
	document.body.addEventListener('keyup', keyUpEvent);
};

window.onload = init;
"use strict";

var update = function update() {

	updateLocalPosition();
	draw();

	animationFrame = requestAnimationFrame(update);
};

var updateLocalPosition = function updateLocalPosition() {
	var doge = doges[hash];

	doge.prevX = doge.x;
	doge.prevY = doge.y;

	if (doge.moveLeft && doge.x > 0) {
		doge.destX -= 1;
		doge.anim = animRows["left"];
	}

	if (doge.moveRight && doge.x < canvas.width - spriteDimensions.width) {
		doge.destX += 1;
		doge.anim = animRows["right"];
	}

	if (doge.jump) {
		doge.anim = animRows["jump"];
	}

	doge.ratio = 0.05;
	socket.emit('dogeMovement', doge);
};

var setDoge = function setDoge(data) {
	hash = data.hash;
	doges[hash] = data;
	animationFrame = requestAnimationFrame(update);
};

var updateDoge = function updateDoge(data) {

	if (!doges[data.hash]) {
		doges[data.hash] = data;
		return;
	}

	if (doges[data.hash].lastUpdate >= data.lastUpdate) {
		return;
	}

	var doge = doges[data.hash];

	if (hash === data.hash) {
		doges[data.hash].destY = data.destY;
		doges[data.hash].jump = data.jump;
		return;
	}

	doge.prevX = data.prevX;
	doge.prevY = data.prevY;
	doge.destX = data.destX;
	doge.destY = data.destY;
	doge.anim = data.anim;
	doge.moveLeft = data.moveLeft;
	doge.moveRight = data.moveRight;
	doge.jump = data.jump;
	doge.ratio = 0.05;
};

var deleteDoge = function deleteDoge(data) {
	if (doges[data.hash]) {
		delete doges[data.hash];
	}
};
