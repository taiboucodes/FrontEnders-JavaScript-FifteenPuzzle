"use strict"; //activate strict mode 
//globals 
var spaceVertical;
var spaceHorizontal;
var puzzlePiece; 
var inform;
var timer;

 window.onload = function () {
	currentBackgroundIndex = Math.floor(Math.random() * backgrounds.length);
    changeBackground(currentBackgroundIndex); // Pass the index to the function
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
	shuffle.onclick = function() { //activates whenever the shuffle button is clicked
		for (var i=0; i<300; i++) {
			var rando = parseInt(Math.random()* 100) %4; //random number created for shuffling pieces
			if (rando == 0) {
				var temp = up(spaceHorizontal, spaceVertical); 
				if ( temp != -1) {
					swap(temp);
				}
			}
			if (rando == 1) {
				var temp = down(spaceHorizontal, spaceVertical);
				if ( temp != -1) 
				{
					swap(temp);
				}
			}
			if (rando == 2) {
				var temp = left(spaceHorizontal, spaceVertical);
				if ( temp != -1)
				{
					swap(temp);
				}
			}
			if (rando == 3) {
				var temp = right(spaceHorizontal, spaceVertical);
				if (temp != -1) {
					swap(temp);
				}
			}
		}
	};
};

function checkMove(position) { // returns true if designated piece can be moved into an empty slot

	if (left(spaceHorizontal, spaceVertical) == (position-1)) {
		return true;
	}
	if (down(spaceHorizontal, spaceVertical) == (position-1)) {
		return true;
	}
	if (up(spaceHorizontal, spaceVertical) == (position-1)) {
		return true;
	}
	if (right(spaceHorizontal, spaceVertical) == (position-1)) {
		return true;
	}
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
	body[0].style.backgroundImage = "url('boxart.jpeg')";
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

function left(x, y) { //calculates how far to the left a puzzlepiece should position

	var cordinateX = parseInt(x);
	var cordinateY = parseInt(y);
	if (cordinateX > 0) {
		for (var i = 0; i < puzzlePiece.length; i++) {
			if (parseInt(puzzlePiece[i].style.left) + 100 == cordinateX && parseInt(puzzlePiece[i].style.top) == cordinateY) {
				return i;
			} 
		}
	}
	else {
		return -1;
	}
}

function right (x, y) { //calculates how far to the right a puzzlepiece should position

	var cordinateX = parseInt(x);
	var cordinateY = parseInt(y);
	if (cordinateX < 300) {
		for (var i =0; i<puzzlePiece.length; i++){
			if (parseInt(puzzlePiece[i].style.left) - 100 == cordinateX && parseInt(puzzlePiece[i].style.top) == cordinateY) {
				return i;
			}
		}
	}
	else {
		return -1;
	} 
}

function up(x, y) { //calculates how far up a puzzlepiece should position
	var cordinateX = parseInt(x);
	var cordinateY = parseInt(y);
	if (cordinateY > 0) {
		for (var i=0; i<puzzlePiece.length; i++) {
			if (parseInt(puzzlePiece[i].style.top) + 100 == cordinateY && parseInt(puzzlePiece[i].style.left) == cordinateX) {
				return i;
			}
		} 
	}
	else {
		return -1;
	}
}
function down (x, y) { //calculates how far down a puzzlepiece should position
	var cordinateX = parseInt(x);
	var cordinateY = parseInt(y);
	if (cordinateY < 300) {
		for (var i=0; i<puzzlePiece.length; i++) {
			if (parseInt(puzzlePiece[i].style.top) - 100 == cordinateY && parseInt(puzzlePiece[i].style.left) == cordinateX) {
				return i;
			}
		}
	}
	else {
		return -1;
	} 
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

