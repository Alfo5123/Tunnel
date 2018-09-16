//vars
var wasp = document.getElementById("wasp");
var scoreCounter = document.getElementById("score");
var objects = document.getElementsByClassName("object");
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
var scoreHeight = scoreCounter.offsetHeight;

var stepSize = 100;
var myMusic;
var gameoff = true ;

//localStorage.getItem('highscore')

//Locate elements on specified coordinates
function put(x, y, el) {
  el.style.top = y + "px";
  el.style.left = x + "px";
}

//Object collision
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

// Create obstacles / points
function makeDiv(id, text, cl) 
{
  var el;
  el = document.createElement("div");
  el.innerHTML = text;
  el.id = id;
  el.className = cl;
  document.body.appendChild(el);
  el.style.top = ( Math.floor(Math.random() * ( screenHeight - scoreHeight) ) + scoreHeight ) + "px";
  el.style.left = screenWidth + "px";
}

//ui
function uiSet(state) {
  if (state == "start") {
    scoreCounter.style.display = "none";
    wasp.style.display = "none";
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
    highscoreHolder.style.display = "none";
    scoreCounter.style.display = "block";
    wasp.style.display = "block";
  }
}

// Function to make background music work
function sound(src) 
{
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

//Start program
function init() {
  uiSet("start");
}

//game start
function gameStart() {
  uiSet("none");
  myMusic = new sound("audio/Omniworld.mp3");
  myMusic.play();
  //document.body.style.backgroundColor =  'rgba(135,93,61,1)'; // Reset color of screen
  gameLoop();
  scoreCounter.innerHTML = "0"; // Reset counter
}

//game end
function gameEnd() {
  uiSet("end");
  gameoff = true;
  clearInterval(loop);
  myMusic.stop()
  objects = document.getElementsByClassName("object");
  var i = objects.length - 1;
  while (i--) {
    document.body.removeChild(objects[i]);
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

//Keystroke pressing functions
window.onkeydown = function(e) 
{
    var kc = e.keyCode;
    e.preventDefault();

    if (kc === 38) Keys.up = true;    
    else if (kc === 40) Keys.down = true;
};

window.onkeyup = function(e) 
{
    var kc = e.keyCode;
    e.preventDefault();

    if (kc === 38) Keys.up = false;
    else if (kc === 40) Keys.down = false;
    else if(e.keyCode == 32){ // Press spacebar
      if (gameoff){
        gameStart();
        gameoff = false;
      }
    };
};

// Main game loop
function gameLoop() 
{
  score = 0;
  var i = 0;
  var speed = 0;
  loop = setInterval(function() 
  {
    // Current wasp coordiantes
    curX = wasp.offsetLeft;
    curY = wasp.offsetTop;

    if (Keys.up) {
      if (curY > screenHeight / stepSize + scoreHeight ) {
       put(curX, curY - screenHeight / stepSize , wasp);
      }
    }
    else if (Keys.down) {  // both up and down does not work so check excl.
      if (curY < screenHeight - Math.max(45,screenHeight / stepSize) ) {
        put(curX, curY + screenHeight / stepSize, wasp);
      }
    }

    i++;
    for (x = 0; x < objects.length; x++) {
      objects[x].style.left = objects[x].offsetLeft - (5 + speed) + "px";

      // when objects colide with wasp
      if (collided(objects[x], wasp) == "hit"  ) {
        if (objects[x].className == "object enemy") {
          gameEnd();
        }
        else{
          // add points
          document.body.removeChild(objects[x]);
          score = score + 5 ;
          scoreCounter.innerHTML = score;
          //document.body.style.backgroundColor =  'rgba(135,93,61,' + (1-0.7*score/60) + ')';
        }
      }
      //remove unseen objects
      if (objects[x].offsetLeft < 0) {
        document.body.removeChild(objects[x]);
      }
    }
    //accelerate objects every second
    if (i == 60) {
      i = 0;
      if (speed < 35) {
        speed = speed + 1;
      }

    }
    // every 1/3 of a sec
    if (i % 19 === 0 && i !== 0) {
      if (i % 3 == 0 ){
        // Points
        makeDiv("id", "", "object point");
      } else {
        //Enemies
        makeDiv("id", "", "object enemy")
      }
    }
  }, 16);
}


//execution
//movement of wasp

playButton.addEventListener("click", function() {
  if (gameoff){
    gameStart();
    gameoff = false;
  }
});


init();