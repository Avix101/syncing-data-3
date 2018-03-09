const update = () => {
	
	updateLocalPosition();
	draw();
	
	animationFrame = requestAnimationFrame(update);
};

const updateLocalPosition = () => {
	const doge = doges[hash];
	
	doge.prevX = doge.x;
	doge.prevY = doge.y;
	
	if(doge.moveLeft && doge.x > 0){
		doge.destX -= 1;
		doge.anim = animRows["left"];
	}
	
	if(doge.moveRight && doge.x < canvas.width - spriteDimensions.width){
		doge.destX += 1;
		doge.anim = animRows["right"];
	}
	
	if(doge.jump){
		doge.anim = animRows["jump"];
	}
	
	doge.ratio = 0.05;
	socket.emit('dogeMovement', doge);
};

const setDoge = (data) => {
	hash = data.hash;
	doges[hash] = data;
	animationFrame = requestAnimationFrame(update);
};

const updateDoge = (data) => {
	
	if(!doges[data.hash]){
		doges[data.hash] = data;
		return;
	}
	
	if(doges[data.hash].lastUpdate >= data.lastUpdate){
		return;
	}
	
	const doge = doges[data.hash];
	
	if(hash === data.hash){
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

const deleteDoge = (data) => {
	if(doges[data.hash]){
		delete doges[data.hash];
	}
};