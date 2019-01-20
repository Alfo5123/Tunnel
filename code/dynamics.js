//vars
var wasp = document.getElementById("wasp");
var scoreCounter = document.getElementById("score");
var levelCounter = document.getElementById("level");
var objects = document.getElementsByClassName("object");
var ui = document.getElementById("ui");
var uiText = document.getElementById("text");
var uiScore = document.getElementById("uiScore");
var playButton = document.getElementById("play");
var highscoreHolder = document.getElementById("highscore")
if(localStorage.getItem('highscore') === null){
   localStorage.setItem('highscore', '0')
   }

// Set soundtrack
var loop;
var myMusic;

// Set dimensions
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var scoreHeight = scoreCounter.offsetHeight;

// Start level counter
levelCounter.style.visibility = "hidden";
var current_level = 1 ;

// Define step size for movement
var numSteps = 100; // Based on the size of the full screen
var stepSize = Math.round(screenHeight / numSteps) 
var extra = ( screenHeight - scoreHeight - wasp.offsetHeight ) % stepSize

// Set game variables
var score;
var gameoff = true ;
var levelPoints = 20 ; 
var totalPoints = 30;
var entropyEpisode = 30 ; 
//localStorage.getItem('highscore')

// Keep track of position distribution
var positions = ( screenHeight - scoreHeight - wasp.offsetHeight - extra )  / stepSize  + 1 
var postDist = new Array( positions ).fill(0);
var entropy;

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

// Entropy calculation
function EntropyCalculation( postDist, num )
{

  function logTerm(total, value, index, array) 
  {
    if ( value == 0 ){
      return total
    }

    return total + value * ( Math.log(num) - Math.log(value) );
  }

  return postDist.reduceRight(logTerm) / num ;
}

// Adaptive speed 
function speedGain( entropy )
{
	if (entropy < 0.7 * Math.log(entropyEpisode) ){
		return 2
	}
	return 0
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
  el.style.top = ( Math.floor(Math.random() * ( screenHeight - scoreHeight) ) + scoreHeight ) + "px"; // Only considers the center coordinates
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
  if (state == "win") {
    ui.style.display = "block";
    playButton.innerHTML = "Level " + current_level;
    uiScore.innerHTML = "Score: " + score;
    uiText.style.fontSize = (screenHeight / 200) + 'em';
    uiText.innerHTML = "You Won!";
    highscoreHolder.style.display = "block"
  }
  if (state == "none") {
    ui.style.display = "none";
    highscoreHolder.style.display = "none";
    scoreCounter.style.visibility = "visible";
    scoreCounter.style.display = "block";
    levelCounter.style.visibility = "visible";
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

// Game start
function gameStart() {
  uiSet("none");

  // Start music 
  myMusic = new sound("audio/Omniworld.mp3");
  myMusic.play();
  //document.body.style.backgroundColor =  'rgba(135,93,61,1)'; // Reset color of screen

  put(wasp.offsetLeft, scoreHeight, wasp)
  gameLoop();
  scoreCounter.innerHTML = "0"; // Reset counter
  levelCounter.innerHTML = "Level " + current_level
  
}

//game end
function gameEnd(defeat = true) {

  levelCounter.style.visibility = "hidden";
  scoreCounter.style.visibility = "hidden";

  // Set screen depending on result
  if (defeat){
    uiSet("end");
  }else{
    uiSet("win");
  }

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
  score = 0; // to keep track of user score
  var i = 0; // to keep track of time
  var j = 0; // to keep track of entropy calculation time
  var speed = 0; // to keep track of objects velocity
  var leftPoints = totalPoints ; // to keep track of how many honeys are left in tunnel
  loop = setInterval(function() 
  {

  	// Display available honey points
  	levelCounter.innerHTML = "Honey " + leftPoints

    // Current wasp coordiantes
    curX = wasp.offsetLeft;
    curY = wasp.offsetTop;

    //console.log( (curY - scoreHeight) / stepSize , postDist[ (curY - scoreHeight) / stepSize ]  ) ;

    if (Keys.up) {
      if (curY > scoreHeight ) {   // limit vertical upward movement by the score banner
       put(curX, curY - stepSize , wasp);
      }
    }
    else if (Keys.down) {  // both up and down does not work so check excl.
      if (curY < screenHeight - Math.max( wasp.offsetHeight + extra , stepSize ))  {
        put(curX, curY + stepSize, wasp);
      }
    }

    i++;
    for (x = 0; x < objects.length; x++) {
      // Smooth accerleration depending on current_level
      objects[x].style.left = objects[x].offsetLeft - (5*(Math.floor(current_level/5)+1) + speed + speedGain(entropy)) + "px";

      // when objects colide with wasp
      if (collided(objects[x], wasp) == "hit"  ) {
        if (objects[x].className == "object enemy") {
          current_level = 1;
          j = 0 , postDist = new Array( positions ).fill(0) // restart frequencies 
          gameEnd(defeat = true);
        }
        else{
          // keep playing to add points
          document.body.removeChild(objects[x]);
          score = score + 1 ;
          scoreCounter.innerHTML = score;

          if (score == levelPoints){ // if maximum score is achieve in level, move to next level
            current_level = current_level + 1 ;
            j = 0 , postDist = new Array( positions ).fill(0) // restart frequencies 
            gameEnd(defeat = false);
          }
          //document.body.style.backgroundColor =  'rgba(135,93,61,' + (1-0.7*score/60) + ')';
        }
      }
      //remove unseen objects
      if (objects[x].offsetLeft < 0) {

      	if (objects[x].className == "object point" &&  leftPoints <= 0 ){  // check if no more points left to play
      		gameEnd(defeat = true);
      	}
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

      // Record current position
      postDist[ (curY - scoreHeight) / stepSize ] += 1
      j += 1

      // Entropy calculation each 10 seconds
      if( j == entropyEpisode){
        entropy = EntropyCalculation( postDist , j )
        console.log(entropy)
        j = 0 , postDist = new Array( positions ).fill(0) // restart frequencies 
      }

      if (i % 3 == 0 ){
        // Points (Honey)
        if (leftPoints > 0){
        	makeDiv("id", "", "object point");
        }
        leftPoints -= 1;

      } else {
        //Enemies (Obstacles)
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