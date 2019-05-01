
console.log("client");
var socket = io();

var movement = {
	up: false,
	down: false,
	left: false,
	right: false,
	fire: false,
}
document.addEventListener('keydown', function (event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = true;
			break;
		case 87: // W
			movement.up = true;
			break;
		case 68: // D
			movement.right = true;
			break;
		case 83: // S
			movement.down = true;
			break;
		case 32: // space
			movement.fire = true;
			break;
	}
});
document.addEventListener('keyup', function (event) {
	switch (event.keyCode) {
		case 65: // A
			movement.left = false;
			break;
		case 87: // W
			movement.up = false;
			break;
		case 68: // D
			movement.right = false;
			break;
		case 83: // S
			movement.down = false;
			break;
		case 32: // space
			movement.fire = false;
			break;
	}
});

socket.emit('new player');
setInterval(function () {

	//calc facing
	if(movement.right){
		if(movement.up){
			movement.facing = "right-up";
		}
		else if(movement.down){
			movement.facing = "right-down";
		}
		else{
			movement.facing = "right";
		}
	}else if(movement.left){
		if(movement.up){
			movement.facing = "left-up";
		}
		else if(movement.down){
			movement.facing = "left-down";
		}
		else{
			movement.facing = "left";
		}
		}else if(movement.up){
		movement.facing = "up";
	}else if(movement.down){
		movement.facing = "down";
	}else{
		movement.facing = "else";
	}
	socket.emit('movement', movement);
}, 1000 / 60);


var hpColor = {
	100: 'rgb(0, 255, 0)',
	90: 'rgb(0, 235, 0)',
	80: 'rgb(0, 215, 0)',
	70: 'rgb(0, 195, 0)',
	60: 'rgb(0, 175, 0)',
	50: 'rgb(0, 155, 0)',
	40: 'rgb(0, 135, 0)',
	30: 'rgb(0, 115, 0)',
	20: 'rgb(0,  95, 0)',
	10: 'rgb(0,  75, 0)',
	0: 'rgb(0,  55, 0)'
};
var hpPredColor = {
	100: 'rgb(255, 0, 0)',
	90: 'rgb(235, 0, 0)',
	80: 'rgb(215, 0, 0)',
	70: 'rgb(195, 0, 0)',
	60: 'rgb(175, 0, 0)',
	50: 'rgb(155, 0, 0)',
	40: 'rgb(135, 0, 0)',
	30: 'rgb(115, 0, 0)',
	20: 'rgb( 95, 0, 0)',
	10: 'rgb( 75, 0, 0)',
	0: 'rgb( 55, 0, 0)'
};
var hpLastPredColor = {
	100: 'rgb(0, 0, 255)',
	90: 'rgb(0, 0, 235)',
	80: 'rgb(0, 0, 215)',
	70: 'rgb(0, 0, 195)',
	60: 'rgb(0, 0, 175)',
	50: 'rgb(0, 0, 155)',
	40: 'rgb(0, 0, 135)',
	30: 'rgb(0, 0, 115)',
	20: 'rgb(0, 0,  95)',
	10: 'rgb(0, 0,  75)',
	0: 'rgb(0, 0,  55)'
};

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
//left pointing images are in row of index 1 in sheet
var srcLeft = 1;
//right facing images are in row of index 2 in sheet
var srcRight = 2;
var srcX=0;
var srcY=0;
//sprite sheet dimensions
var sheetWidth = 256;
var sheetHeight = 256;
var cols = 4;
var rows = 4
//width and height of each frame:
var width = sheetWidth / cols; //64
var height = sheetHeight / rows //64

var currentFrame = 0;

var bulb = new Image();

bulb.src = "/static/bulb.png"
var context = canvas.getContext('2d');
socket.on('state', function (obj) {
	context.clearRect(0, 0, 800, 600);
	for (var id in obj.players) {
		var player = obj.players[id];
		if (player.lastPredator) {
			if (player.predator) {
				context.fillStyle = hpPredColor[player.hp];
			} else {
				context.fillStyle = hpLastPredColor[player.hp];
			}
			context.beginPath();
			context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
			context.fill();
		} else if (player.predator) {
			context.fillStyle = hpPredColor[player.hp];
			context.beginPath();
			context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
			context.fill();
		} else {
			// context.fillStyle = hpColor[player.hp]; 
			console.log(player.facing);
			
			context.drawImage(bulb, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
			//console.log(bulb, srcX, srcY, width, height, player.x, player.y, width, height)
		}
		/*player.predator ? 
			hpPredColor[player.hp] : player.lastPredator ? 
				hpLastPredColor[player.hp] : hpColor[player.hp];
		*/


		///
		// context.beginPath();
		// context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
		// context.fill();
	}
	for (var p in obj.projectiles) {
		var prj = obj.projectiles[p];
		context.fillStyle = 'lime';
		context.beginPath();
		context.arc(prj.x, prj.y, 4, 0, 2 * Math.PI);
		context.fill();
	}
});


function getSrcY(facing){
	if(facing.slice(0,4) == "left"){
		return 1 * height;
	}
	if(facing.slice(0,5) == "right"){
		return 2 * height;
	}
	if(facing == "up"){
		return 3 * height;
	}
	if(facing == "down"){
		return 0 * height;
	}if(facing == "else"){
		return 0 * height;
	}
	
}





