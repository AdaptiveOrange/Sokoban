// LOAD HTML
(function(w) {
	"use strict";
	// Load
	document.onreadystatechange = function() {
		if(document.readyState == "complete") {

			console.log("document loaded");
			// Start  game function
			startGame();
		} else {
			//loading here
		}
	}

}) ();

// VARIABLES
var victory = 0;
var boxesDone = 0;
var tileGoals = []; 

// CONTROLLS
//keydown - arrowkeys
document.onkeydown = function(event) {
switch(event.keyCode) {
	case 37: // left check -1
	    console.log("left");
	    var left = 1;
	    move(left);
	    break;

	case 38: // up - width (-19)
	    console.log("up");
	    var up = tileMap01.width;
	    move(up);
	    break;

	case 39: // right check +1
	    console.log("right");
	    var right = -1;
	    move(right);
	    break;

	case 40: // down +width (+19)
	    console.log("down");
	    var down = -tileMap01.width;
	    move(down);
	    break;

	default: // other than arrowkey
	    console.log("other key"); 
	    return; 
	}
    event.preventDefault(); // prevent the default to happen
}

function startGame() {
	//Menu here - later
	
	setWidth(tileMap01.width);
	//Draw the map in div gameBoard
	drawGameBoard();
}

function setWidth(w) {
	//change width of gameboard equal to amount of divs in a row
	var calcWidth = w * 40;
	document.getElementById("gameBoard").style.width = calcWidth + 'px';
}

//start the game
function drawGameBoard() {
	var k = 0;
	// Loop MapGrid array and create divs for each 
	for(var i = 0; i<tileMap01.height; i++) {
		//var rowClass = "row"+i;
		console.log(rowClass);
		var rowClass = "gameBoard";
		
		for(var j = 0; j<tileMap01.width; j++) {
			k++; // assign id to divs
			//tile empty
			if (tileMap01.mapGrid[i][j] == ' ' ) {
				// create div and add class tilespace
				addDivToParent(Tiles.Space, rowClass, k);
			}

			else if(tileMap01.mapGrid[i][j] == 'W') {
				// create div and add class tilespace
				addDivToParent(Tiles.Wall, rowClass, k);
				
				
			}

			else if(tileMap01.mapGrid[i][j] == 'B') {
				// create div and add class tilespace
				addDivToParent(Entities.Block, rowClass, k);
				// add tile-space to classList
				addExtraTile(k);
			}

			else if(tileMap01.mapGrid[i][j] == 'G') {
				// create div and add class tilespace
				addDivToParent(Tiles.Goal, rowClass, k);
				// amount of boxes that needs to be on tile-goals
				victory++;
				// add id to array to check if game is finished later on
				tileGoals.push(k);
			}

			else if(tileMap01.mapGrid[i][j] == 'P') {
				// create div and add class tilespace        
				addDivToParent(Entities.Character, rowClass, k);
				// add tile-space to classList
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
	//create li element
	var node = document.createElement("DIV");
	//add a class to div          
	node.classList.add(className);
	node.id = idNum;
	//add div to parent div gameBoard
	document.getElementById(parentDiv).appendChild(node);
}

function addExtraTile(idNum) {
	document.getElementById(idNum).classList.add("tile-space");
}

// Get id of the player tile
function getPlayerPos() {
	//store player id in variable
	var playerPos = document.getElementsByClassName("entity-player")[0].id;
	//console.log(playerPos);
	return playerPos;
}

function move(pos) {
	// store player pos
	var oldPos = getPlayerPos();
	// Store targeted position
	var newPos = oldPos - pos;
	//console.log(newPos);
	
	// get id and save the class
	var newPosClass = document.getElementById(newPos).className;
	//console.log(newPosClass);
	collision(newPosClass, newPos, oldPos, pos);
}

// Check for collision with other tiles
function collision(newPosClass , newPos, oldPos, pos) {
	if (newPosClass == Tiles.Wall) {
		// new position is a wall do nothing
		console.log("collision: " + Tiles.Wall);
	}

	else if (newPosClass == Tiles.Goal) {
		// new position is a wall do nothing
		console.log("Walking on " + newPosClass);
		
		document.getElementById(newPos).classList.add(Entities.Character);
		document.getElementById(oldPos).classList.remove(Entities.Character);
	}

	else if (newPosClass == Tiles.Space ) {
		console.log("walking on tile-space");
		// new position is a tile-space: aadd payer class to new tile 
		// and tile-space to the old player position
		document.getElementById(newPos).classList.add(Entities.Character);
		document.getElementById(oldPos).classList.remove(Entities.Character);
		
	}
		

	// check if the two squares in choosen direction is wall or block
	// if one of them are, do nothing
 	else if (document.getElementById(newPos-pos).classList.item(0) != Entities.Block &&
 		document.getElementById(newPos-pos).classList.item(1) != Entities.Block 
 		&& document.getElementById(newPos-pos).classList.item(0)!= Tiles.Wall) {
 		
 		console.log("moving block");
 		// add and remove character class in chosen direction
		document.getElementById(newPos).classList.add(Entities.Character);
		document.getElementById(oldPos).classList.remove(Entities.Character);
		// add and remove block class in chosen direction
		document.getElementById(newPos).classList.remove(Entities.Block);
		document.getElementById(newPos-pos).classList.add(Entities.Block);
		document.getElementById(newPos).classList.remove(Entities.BlockDone);

		// Check if target position is a goal
		if(document.getElementById(newPos-pos).classList.item(0) == Tiles.Goal ||
			document.getElementById(newPos-pos).classList.item(1) == Tiles.Goal) {
			// Add BlockDone
			document.getElementById(newPos-pos).classList.add(Entities.BlockDone);
			document.getElementById(newPos).classList.remove(Entities.BlockDone);
		}

		victory = checkVictory();
		// if victory equals number of Entities BlockDone
		if (victory == tileGoals.length) {
			console.log("victory " + victory);
			alert("LEVEL COMPLETE");
		} 
	}

	function checkVictory() {
		var temp = 0;
		for(var i = 0; i < tileGoals.length; i++) {
			if (document.getElementById(tileGoals[i]).classList.item(2) == Entities.BlockDone){
				temp++;
			}
		}
		// return number to variable victory
		console.log(temp + " box/boxes in the goal");
		return temp;
	}
}
