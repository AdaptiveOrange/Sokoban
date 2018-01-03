(function(w) {
	"use strict";
	// Load
	document.onreadystatechange = function() {
		if(document.readyState == "complete") {
			console.log("document loaded");
			startGame();
		} else {
			// 
		}
	}

}) ();

var victory = 0;
var boxesDone = 0;
var tileGoals = []; 
var tileSize = 36;

document.onkeydown = function(event) {
    	
	switch(event.keyCode) {
		case 37: 
		    var left = 1;
		    move(left);
		    break;

		case 38: 
		    var up = tileMap01.width;
		    move(up);
		    break;

		case 39: 
		    var right = -1;
		    move(right);
		    break;

		case 40: 
		    var down = -tileMap01.width;
		    move(down);
		    break;
		default: 
		    return; 
		}

    event.preventDefault(); 
}

function startGame() {
	setWidth(tileMap01.width);
	drawGameBoard(tileMap01);	
}

function setWidth(w) {
	var calcWidth = w * tileSize;
	document.getElementById("gameBoard").style.width = calcWidth + 'px';
}

function drawGameBoard(tileMap) {
	var k = 0;
	for(var i = 0; i<tileMap.height; i++) {
		console.log(rowClass);
		var rowClass = "gameBoard";
		
		for(var j = 0; j<tileMap.width; j++) {
			k++;
			if (tileMap.mapGrid[i][j] == '.' ) {
				addDivToParent(Tiles.Space, rowClass, k);
			}

			else if (tileMap.mapGrid[i][j] == ' ' ) {
				addDivToParent(Tiles.Background, rowClass, k);
			}

			else if(tileMap.mapGrid[i][j] == 'W') {
				addDivToParent(Tiles.Wall, rowClass, k);
			}

			else if(tileMap.mapGrid[i][j] == 'B') {
				addDivToParent(Entities.Block, rowClass, k);
				addExtraTile(k);
			}

			else if(tileMap01.mapGrid[i][j] == 'G') {
				addDivToParent(Tiles.Goal, rowClass, k);
				victory++;
				tileGoals.push(k);
			}

			else if(tileMap01.mapGrid[i][j] == 'P') {
				addDivToParent(Entities.Character, rowClass, k);
				addExtraTile(k);
			}
				
			else {
				console.log("false");
				throw "Tile error";
			}
		}
	}
}

function addDivToParent(className, parentDiv, idNum) {
	var node = document.createElement("DIV");        
	node.classList.add(className);
	node.id = idNum;
	document.getElementById(parentDiv).appendChild(node);
}

function addExtraTile(idNum) {
	document.getElementById(idNum).classList.add("tile-space");
}

function getPlayerPos() {
	var playerPos = document.getElementsByClassName("entity-player")[0].id;
	return playerPos;
}

function move(pos) {
	var playerPos = getPlayerPos();
	var oldPos = document.getElementById(playerPos);
	var newPos = document.getElementById(playerPos-pos);
	console.log(newPos);
	var newPosPlusOne = document.getElementById(playerPos-pos-pos);
	var newPosClass = newPos.className;
	collision(newPosClass, newPos, oldPos, newPosPlusOne);
}

function collision(newPosClass , newPos, oldPos, newPosPlusOne) {
	if (newPosClass == Tiles.Wall) {
	}

	else if (newPosClass == Tiles.Goal) {
		newPos.classList.add(Entities.Character);
		oldPos.classList.remove(Entities.Character);
	}

	else if (newPosClass == Tiles.Space ) {
		newPos.classList.add(Entities.Character);
		oldPos.classList.remove(Entities.Character);
	}

 	else if (!newPosPlusOne.classList.contains(Entities.Block) &&
 			 !newPosPlusOne.classList.contains(Tiles.Wall)) {
		newPos.classList.add(Entities.Character);
		oldPos.classList.remove(Entities.Character);
		newPos.classList.remove(Entities.Block);
		newPosPlusOne.classList.add(Entities.Block);
		newPos.classList.remove(Entities.BlockDone);

		if(newPosPlusOne.classList.contains(Tiles.Goal)) {
			newPosPlusOne.classList.add(Entities.BlockDone);
			newPos.classList.remove(Entities.BlockDone);
		}

		victory = checkVictory();
		var victoryText = document.getElementById("victory");
		victoryText.innerHTML = victory + "/" + tileGoals.length + " to complete level"
		if (victory == tileGoals.length) {
			victoryText.innerHTML = victory + "/" + tileGoals.length + " level complete!"
			console.log("victory " + victory);
		} 
	}

	function checkVictory() {
		var blockDone = 0;
		for(var i = 0; i < tileGoals.length; i++) {
			if (document.getElementById(tileGoals[i]).classList.contains(Entities.BlockDone)) {
				blockDone++;
			}
		}
		return blockDone;
	}
}


