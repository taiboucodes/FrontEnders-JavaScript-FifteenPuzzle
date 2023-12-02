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
var gameStarted = false;
var shuffleAllowed = true;

 window.onload = function () {
	loadLeaderboard();
	timerElement = document.getElementById('timer');
   
	
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
				moveCount++;
				if (finish()) { //checks whether or not the user has completed the game
					win(); //informs user of win 
				}
				return;
			}
		};
	}

	var shuffle = document.getElementById('shufflebutton'); 
	spaceHorizontal = '300px'; 
     spaceVertical = '300px';
     

shuffle.onclick = function () {
    const music = document.getElementById("music");
    music.play();

    if (shuffleAllowed) {
        shuffleAllowed = false;

        if (!gameStarted) {
            gameStarted = true;
            var button = document.getElementById("shufflebutton");
            button.textContent = "Shuffle";
            timerInterval = setInterval(updateTimer, 1000);
        }

        for (var i = 0; i < 300; i++) {
            var rando = parseInt(Math.random() * 100) % 4;
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

        // Allow shuffling again after a delay (adjust the timeout duration if needed)
        setTimeout(function () {
            shuffleAllowed = true;
        }, 1);
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



function Inform() {  
	inform --; 
	if (inform == 0) { 
        document.getElementById("youWon").style.display = "block";
		var para=document.getElementsByClassName('explanation');
	    para[0].style.visibility="visible"; 
		return;
	}
	else if (inform % 2) {
		var body = document.getElementsByTagName('body'); 
	}
}

function win() { //notifies user that they have won
	var body = document.getElementsByTagName('body');
	inform = 1; //initializes notify variable
	timer= setTimeout(Inform, 200);
	var para=document.getElementsByClassName('explanation');
	clearInterval(timerInterval);
	saveWinningInfo(seconds, moveCount);
	var winningInfo = getMostRecentWinningInfo();
    var textContentDiv = document.getElementById('textContent');
    textContentDiv.innerHTML = 'Your Time: ' + winningInfo.time + ' | Moves: ' + winningInfo.moves;
}
function getMostRecentWinningInfo() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'getBestTimes.php', false);
    xhr.send();

    if (xhr.status == 200) {
        var leaderboardData = JSON.parse(xhr.responseText);
        if (leaderboardData.length > 0) {
            var mostRecentInfo = leaderboardData[leaderboardData.length - 1].split(', ');
            return { time: mostRecentInfo[0], moves: mostRecentInfo[1] };
        }
    }

    return { time: 'N/A', moves: 'N/A' };
}
function saveWinningInfo(timeInSeconds, moves) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'updateBestTimes.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Handle any response if needed
        }
    };

    // Send the request with the winning time and moves as POST parameters
    xhr.send('winningTime=' + encodeURIComponent(timeInSeconds + 's') + '&moves=' + encodeURIComponent(moves + ' moves'));
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

function makeItPop() {
    var rulesPopUp = document.getElementById("rulesPopUp");
    var rulesButton = document.getElementById("rulesButton");
    if (rulesPopUp.style.display === "block") {
        rulesButton.textContent = "View Rules";
        rulesPopUp.style.display = "none";
    } else {
        rulesPopUp.style.display = "block";
        rulesButton.textContent = "Hide Rules";
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
var backgrounds = ['background.jpg', 'donkeykong.jpg', 'galaxy.jpg', 'Bowser.png'];

function changeBackground(selectedIndex) {
    currentBackgroundIndex = selectedIndex;
    var puzzlePieces = document.querySelectorAll('.puzzleFragment');
    puzzlePieces.forEach(function(piece, index) {
        piece.style.backgroundImage = 'url(' + backgrounds[currentBackgroundIndex] + ')';
        piece.style.backgroundPosition = '-' + (index % 4 * 100) + 'px -' + (parseInt(index / 4) * 100) + 'px';
    });
}
function updateTimer() {
    seconds++;
    timerElement.innerHTML = 'Time: ' + seconds + 's';
}
function initializeTimer() {
    seconds = 0; // Reset the seconds
	moveCount = 0; // Reset the move count
    updateTimer(); // Update the timer display immediately

    // Clear any existing timer interval
    clearInterval(timerInterval);

    // Start a new timer interval
    timerInterval = setInterval(updateTimer, 1000);
}


function loadLeaderboard() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var leaderboardData = JSON.parse(xhr.responseText);
                console.log('Leaderboard Data:', leaderboardData); // Add this line
                displayLeaderboard(leaderboardData);
            } else {
                console.error('Failed to load leaderboard. Status:', xhr.status);
            }
        }
    };
    xhr.open('GET', 'getBestTimes.php', true);
    xhr.send();
}

function playAudio() {
    const music = document.getElementById("music")
    music.play();
}
function pauseAudio() {
    const music = document.getElementById("music")
    music.pause();
}

function restart() {
    location.reload();
}

function displayLeaderboard(leaderboardData) {
    var leaderboardTable = document.getElementById('leaderboardTable');
    var tbody = leaderboardTable.getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear existing rows

    for (var i = 0; i < leaderboardData.length; i++) {
        var rowData = leaderboardData[i].split(', ');

        var rank = i + 1;
        var time = rowData[0];
        var moves = rowData[1];

        var row = '<tr><td>#' + rank + '</td><td>' + time + '</td><td>' + moves + '</td></tr>';
        console.log('Row:', row); // Add this line
        tbody.innerHTML += row;
    }
    
}
