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
var stepSize = 100;
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
function makeDiv(id, text, cl, type) {
  var el;
  el = document.createElement("div");

  // Change color according to difficulty
  if ( type == 1 ){
    el.style.setProperty('background-color', '#000');
  }

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
    uiText.style.fontSize = (screenHeight / 150) + 'em';
    uiText.innerHTML = "Tunnel";
    highscoreHolder.style.display = "none"
  }
  if (state == "end") {
    ui.style.display = "block";
    playButton.innerHTML = "RETRY";
    uiScore.innerHTML = "Score: " + score;
    uiText.style.fontSize = (screenHeight / 200) + 'em';
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
  highscoreHolder.innerHTML = "Personal Best: " + localStorage.getItem('highscore')
}

// Movement keystroke
var Keys = {
        up: false,
        down: false
    };

window.onkeydown = function(e) {
    var kc = e.keyCode;
    e.preventDefault();

    if (kc === 38) Keys.up = true;    // so check exclusively
    else if (kc === 40) Keys.down = true;
};

window.onkeyup = function(e) {
    var kc = e.keyCode;
    e.preventDefault();

    if (kc === 38) Keys.up = false;
    else if (kc === 40) Keys.down = false;
};

// gameLoop
function gameLoop() {
  score = 0;
  var i = 0;
  var speed = 0;
  loop = setInterval(function() {

    curX = ship.offsetLeft;
    curY = ship.offsetTop;

    if (Keys.up) {
      if (curY > screenHeight / stepSize) {
       put(curX, curY - screenHeight / stepSize, ship);
      }
    }
    else if (Keys.down) {  // both up and down does not work so check excl.
      if (curY < screenHeight - Math.max(40,screenHeight / stepSize) ) {
        put(curX, curY + screenHeight / stepSize, ship);
      }
    }

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
      if (i % 2 == 0 ){
        makeDiv("id", "", "rocket", 0 );
      } else {
        makeDiv("id", "", "rocket", 1)
      }
    }
  }, 16);
}


//function fadeOut(el){el.style.opacity=1;(function fade(){if((el.style.opacity-=.1)<0){el.style.display="none";}else{requestAnimationFrame(fade);}})();}
//execution
//movement of ship


playButton.addEventListener("click", function() {
  //Preview Display
  //Fade out Progress Bar
  gameStart();
});


init();