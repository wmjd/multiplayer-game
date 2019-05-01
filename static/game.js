
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
var pika = new Image();
var char = new Image();
bulb.src = "/static/bulb.png";
pika.src = "/static/pika.png";
char.src = "/static/char.png";
var context = canvas.getContext('2d');
socket.on('state', function (obj) {
	context.clearRect(0, 0, 800, 600);
	for (var id in obj.players) {
		var player = obj.players[id];
		if (player.lastPredator) {
			if (player.predator) {
				context.drawImage(pika, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
			} else {
				context.drawImage(char, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
		
			}
		} else if (player.predator) {
			context.drawImage(pika, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);

		} else {
			console.log(player.facing);
			
			context.drawImage(bulb, player.frameX * width, getSrcY(player.facing), width, height, player.x, player.y, width, height);
		}
	}
	for (var p in obj.projectiles) {
		var prj = obj.projectiles[p];
		context.fillStyle = 'red';
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





