"use strict"; //activate strict mode 
//globals 
var spaceVertical;
var spaceHorizontal;
var puzzlePiece; 
var inform;
var timer;
var timerElement;
var seconds = 0;
var moveCount = 0; 
var timerInterval;
var currentBackgroundIndex = 0;
var backgrounds = ['background.jpg', 'DK.jpg', 'galaxy.jpg', 'bowser.jpg'];

 window.onload = function () {
	var puzzleRegion = document.getElementById('puzzleRegion');
	puzzlePiece = puzzleRegion.getElementsByTagName('div'); //retrieve element within puzzlearea
	for (var i=0; i<puzzlePiece.length; i++) { //applies features to each puzzle piece 
	
		puzzlePiece[i].className = 'puzzleFragment'; //setting up the puzzle piece code
		puzzlePiece[i].style.left = (i%4*100)+'px'; //calculates the position for puzzle pieces from the left of the screen
		puzzlePiece[i].style.top = (parseInt(i/4)*100) + 'px'; //calculates the position for puzzle pieces from the top of the screen
		puzzlePiece[i].style.backgroundPosition= '-' + puzzlePiece[i].style.left + ' ' + '-' + puzzlePiece[i].style.top; //calculates the position of the background picture so in moves in relation to the puzzle pieces
		puzzlePiece[i].onmouseover = function() { //applies features when mouse moves over puzzle pieces
		
			if (checkMove(parseInt(this.innerHTML))) { //checks whenever a move is made
				this.style.border = "3px solid red"; //purple when near an empty space
				this.style.color = "#006600"; //text red when near an empty space
				this.style.textDecoration = "underline"; //underlines number
                this.style.cursor ="pointer";
                //sets the image for the puzzle's background 
			}
		};
		puzzlePiece[i].onmouseout = function() { //functionality to revert 
			this.style.border = "2px solid black";
			this.style.color = "#000000";
			this.style.textDecoration = "none"; 
		};
		puzzlePiece[i].onclick = function() { //click function

			if (checkMove(parseInt(this.innerHTML))) { //checks if puzzle piece can move to an empty space
				swap(this.innerHTML-1); //if space is empty it will move the piece to the empty slot
				if (finish()) { //checks whether or not the user has completed the game
					win(); //informs user of win 
				}
				return;
			}
		};
	}

	var shuffle = document.getElementById('shufflebutton'); //initializes the shuffle button
	spaceHorizontal = '300px'; 
	spaceVertical = '300px';
	// This function is triggered when the shuffle button is clicked.
    // It shuffles the puzzle pieces by randomly moving the empty space in different directions.
	shuffle.onclick = function() {
		for (var i = 0; i < 300; i++) { // iterates 300 times
			var rando = parseInt(Math.random() * 100) % 4; //random number created for shuffling pieces
			var temp;
			if (rando === 0) {
				temp = movePiece(spaceHorizontal, spaceVertical, 'up');
			} else if (rando === 1) {
				temp = movePiece(spaceHorizontal, spaceVertical, 'down');
			} else if (rando === 2) {
				temp = movePiece(spaceHorizontal, spaceVertical, 'left');
			} else if (rando === 3) {
				temp = movePiece(spaceHorizontal, spaceVertical, 'right');
			}
			if (temp != -1) {
				swap(temp);
			}
		}
	};
	currentBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
	changeBackground(currentBackgroundIndex);
 }	
// The checkMove function determines if the puzzle piece at the given position can be moved into an adjacent empty space.
// 'position' is the number of the puzzle piece being checked.
function checkMove(position) {
    if (movePiece(spaceHorizontal, spaceVertical, 'left') == (position - 1)) {
        return true;
    }
    if (movePiece(spaceHorizontal, spaceVertical, 'down') == (position - 1)) {
        return true;
    }
    if (movePiece(spaceHorizontal, spaceVertical, 'up') == (position - 1)) {
        return true;
    }
    if (movePiece(spaceHorizontal, spaceVertical, 'right') == (position - 1)) {
        return true;
    }
    return false;
}

function Inform() { //notifies user 
	inform --; //decrements  
	if (inform == 0) { //does value reach end 
		var body = document.getElementsByTagName('body');
		body[0].style.backgroundImage = "url('winner.gif')"; //reverts to original page background
		alert('You are a winner ! Shuffle to play again'); //informs player they won
		var para=document.getElementsByClassName('explanation');
	    para[0].style.visibility="visible"; 
		return;
	}
	else if (inform % 2) {
		var body = document.getElementsByTagName('body'); 
	    body[0].style.backgroundImage = "url('winner.gif')";
	    //sets background pic upon completion
	}
    timer= setTimeout(Inform, 200); //notifies the user for 2 secs
}

function win() { //notifies user that they have won
	var body = document.getElementsByTagName('body');
	body[0].style.backgroundImage = "url('winner.jpg')";
	inform = 10; //initializes notify variable
	timer= setTimeout(Inform, 200);
	var para=document.getElementsByClassName('explanation');
	// para[0].style.visibility="hidden"; 
}

function finish() { //checks when the game reaches its end
	var flag = true;
	for (var i = 0; i < puzzlePiece.length; i++) {
		var top = parseInt(puzzlePiece[i].style.top);
		var left = parseInt(puzzlePiece[i].style.left);
		if (left != (i%4*100) || top != parseInt(i/4)*100) {
			flag = false;
			break;
		}
	}
	return flag;
}
// The function checks if a puzzle piece can be moved into an empty slot.
// It takes the position of the puzzle piece as an argument.
function movePiece(x, y, direction) { 
    var coordinateX = parseInt(x);
    var coordinateY = parseInt(y);
    var newX, newY;

    switch (direction) {
        case 'left':
            newX = coordinateX - 100;
            newY = coordinateY;
            if (coordinateX <= 0) return -1;
            break;
        case 'right':
            newX = coordinateX + 100;
            newY = coordinateY;
            if (coordinateX >= 300) return -1;
            break;
        case 'up':
            newX = coordinateX;
            newY = coordinateY - 100;
            if (coordinateY <= 0) return -1;
            break;
        case 'down':
            newX = coordinateX;
            newY = coordinateY + 100;
            if (coordinateY >= 300) return -1;
            break;
        default:
            return -1; // Invalid direction
    }
    for (var i = 0; i < puzzlePiece.length; i++) {
        if (parseInt(puzzlePiece[i].style.left) == newX && parseInt(puzzlePiece[i].style.top) == newY) {
            return i;
        }
    }
    return -1;
}

function swap(position) {
    var temp = puzzlePiece[position].style.top;
	puzzlePiece[position].style.top = spaceVertical;
	spaceVertical = temp;
	temp = puzzlePiece[position].style.left;
	puzzlePiece[position].style.left = spaceHorizontal;
	spaceHorizontal = temp;
}
var currentBackgroundIndex = 0;
var backgrounds = ['background.jpg', 'DK.jpg', 'galaxy.jpg', 'bowser.jpg'];

function changeBackground(selectedIndex) {
    // Use the index from the parameter
    currentBackgroundIndex = selectedIndex;
    var puzzlePieces = document.querySelectorAll('.puzzleFragment');
    puzzlePieces.forEach(function(piece, index) {
        piece.style.backgroundImage = 'url(' + backgrounds[currentBackgroundIndex] + ')';
        // Recalculate background position based on the new image
        piece.style.backgroundPosition = '-' + (index % 4 * 100) + 'px -' + (parseInt(index / 4) * 100) + 'px';
    });
}
