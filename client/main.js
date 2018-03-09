let canvas, ctx, dogeSprite, animationFrame;
let socket, hash;
let doges = {};

//Limit advances in sprite frames (to avoid rapid animation)
let frameLimiter = 0;
let frameLimit = 10;

const keyDownEvent = (e) => {
	const key = e.which;
	const doge = doges[hash];
	
	if(key === 65 || key === 37){
		doge.moveLeft = true;
	} else if(key === 68 || key === 39){
		doge.moveRight = true;
	//Spacebar for jumping
	} else if(key === 32 && doge.y >= canvas.height - spriteDimensions.height - 1){
		doge.jump = true;
	}
};

const keyUpEvent = (e) => {
	const key = e.which;
	const doge = doges[hash];
	
	if(key === 65 || key === 37){
		doge.moveLeft = false;
	} else if(key === 68 || key === 39){
		doge.moveRight = false;
	}
};

const init = () => {
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