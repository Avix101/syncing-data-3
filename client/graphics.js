const spriteDimensions = {
	width: 64,
	height: 64,
};

const animRows = {
	forward: 0,
	right: 1,
	left: 3,
	jump: 8,
};

const lerp = (pos1, pos2, ratio) => {
	const component1 = (1 - ratio) * pos1;
	const component2 = ratio * pos2;
	return component1 + component2;
};

const draw = () => {
	ctx.clearRect(0, 0, 500, 500);
	
	const dogeKeys = Object.keys(doges);
	
	for(let i = 0; i < dogeKeys.length; i++){
		const doge = doges[dogeKeys[i]];
		
		if(doge.ratio < 1){
			doge.ratio += 0.05;
		}
		
		ctx.save();
		
		if(doge.hash === hash){
			ctx.filter = "brightness(1.5)";
		} else {
			ctx.filter = "none";
		}
		
		doge.x = lerp(doge.prevX, doge.destX, doge.ratio);
		doge.y = lerp(doge.prevY, doge.destY, doge.ratio);
		
		frameLimiter++;
		
		if(frameLimiter > frameLimit){
			if(doge.moveLeft || doge.moveRight){
				doge.frame = (doge.frame + 1) % 4;
			} else if(doge.y < 435){
				doge.anim = animRows["jump"];
				doge.frame = (doge.frame + 1) % 3;
			} else {
				doge.anim = animRows["forward"];
				doge.frame = (doge.frame + 1) % 3
			}
			
			frameLimiter = 0;
		}
		
		ctx.drawImage(
			dogeSprite,
			32 * doge.frame,
			32 * doge.anim,
			32,
			32,
			doge.x,
			doge.y,
			spriteDimensions.width,
			spriteDimensions.height
		);
		
		ctx.restore();
	}
};