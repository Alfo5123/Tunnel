//vars
var ship = document.getElementById("ship");
var scoreCounter = document.getElementById("score");
var rockets = document.getElementsByClassName("rocket");
var ui = document.getElementById("ui");
var uiText = document.getElementById("text");
var uiScore = document.getElementById("uiScore");
var playButton = document.getElementById("play");
var highscoreHolder = document.getElementById("highscore")
if(localStorage.getItem('highscore') === null){
   localStorage.setItem('highscore', '0')
   }
var score;
var loop;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var stepSize = 15;
//localStorage.getItem('highscore')

//puts element on specified coardinate
function put(x, y, el) {
  el.style.top = y + "px";
  el.style.left = x + "px";
}

//colision
function collided(el1, el2) {
  //el1 info
  var one = {};
  one.radius = el1.offsetWidth / 2;
  one.yPos = el1.offsetTop + one.radius;
  one.xPos = el1.offsetLeft + one.radius;

  //el2 info
  var two = {};
  two.radius = el2.offsetWidth / 2;
  two.yPos = el2.offsetTop + two.radius;
  two.xPos = el2.offsetLeft + two.radius;

  //scope fix
  var yDis;
  var xDis;

  //find y distance
  if (two.yPos > one.yPos) {
    yDis = two.yPos - one.yPos;
  } else {
    yDis = one.yPos - two.yPos;
  }

  //find x distance
  if (two.xPos > one.xPos) {
    xDis = two.xPos - one.xPos;
  } else {
    xDis = one.xPos - two.xPos;
  }

  //pythagorean theorem finds distance
  var dis = Math.sqrt(yDis * yDis + xDis * xDis);

  //do something on colision
  if (dis < one.radius + two.radius) {
    return "hit";
  }
}

// make rocket
function makeDiv(id, text, cl) {
  var el;
  el = document.createElement("div");
  el.innerHTML = text;
  el.id = id;
  el.className = cl;
  document.body.appendChild(el);
  el.style.top = Math.floor(Math.random() * screenHeight) + "px";
  el.style.left = screenWidth + "px";
}

//ui
function uiSet(state) {
  if (state == "start") {
    ui.style.display = "block";
    playButton.innerHTML = "PLAY";
    uiScore.innerHTML = "";
    uiText.innerHTML = "ASTEROID</br>DODGE";
    highscoreHolder.style.display = "none"
  }
  if (state == "end") {
    ui.style.display = "block";
    playButton.innerHTML = "RETRY";
    uiScore.innerHTML = "Score: " + score;
    uiText.innerHTML = "GAME OVER";
    highscoreHolder.style.display = "block"
  }
  if (state == "none") {
    ui.style.display = "none";
    highscoreHolder.style.display = "none"
  }
}

//program start
function init() {
  uiSet("start");
}
//game start
function gameStart() {
  uiSet("none");
  gameLoop();
  scoreCounter.innerHTML = "0";
}
//game end
function gameEnd() {
  uiSet("end");
  clearInterval(loop);
  rockets = document.getElementsByClassName("rocket");
  var i = rockets.length - 1;
  while (i--) {
    document.body.removeChild(rockets[i]);
  }
  if(parseInt(localStorage.getItem('highscore')) < score){
     localStorage.setItem('highscore', score + "")
      
     }
  highscoreHolder.innerHTML = "Your Highscore: " + localStorage.getItem('highscore')
}

// gameLoop
function gameLoop() {
  score = 0;
  var i = 0;
  var speed = 0;
  loop = setInterval(function() {
    i++;
    for (x = 0; x < rockets.length; x++) {
      rockets[x].style.left = rockets[x].offsetLeft - (5 + speed) + "px";

      // when rockets colide with ship
      if (collided(rockets[x], ship) == "hit") {
        gameEnd();
      }
      //remove unseen rockets
      //adds score
      if (rockets[x].offsetLeft < 0) {
        document.body.removeChild(rockets[x]);
        score++;
        scoreCounter.innerHTML = score;
      }
    }
    //every second
    if (i == 60) {
      i = 0;
      if (speed < 35) {
        speed = speed + 1;
      }

    }
    // every 1/3 of a sec
    if (i % 19 === 0 && i !== 0) {
      makeDiv("id", "", "rocket");
    }
  }, 16);
}

//execution
//movement of ship
playButton.addEventListener("click", function() {
  gameStart();
});

document.addEventListener("keydown", function(e) {
  curX = ship.offsetLeft;
  curY = ship.offsetTop;

  //down
  if (e.keyCode == "40") {
    if (ship.offsetTop < screenHeight - screenHeight / stepSize) {
      put(curX, curY + screenHeight / stepSize, ship);
    }
  }

  //up
  if (e.keyCode == "38") {
    if (ship.offsetTop > screenHeight / stepSize) {
      put(curX, curY - screenHeight / stepSize, ship);
    }
  }
});

init();

