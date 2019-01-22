/*

Tunnel 
by Alfredo de la Fuente <alfredo.delafuente.b@gmail.com>

*/

//global variables
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

// Set soundtrack
var loop;
var myMusic;

// Set dimensions
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var scoreHeight = scoreCounter.offsetHeight;

// Define step size for movement
var numSteps = 100; // Based on the size of the full screen
var stepSize = Math.round(screenHeight / numSteps) 
var extra = ( screenHeight - scoreHeight - wasp.offsetHeight ) % stepSize

// Set game variables
var score;
var gameoff = true ;
var entropyEpisode = 15 ; 
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

// Linear interpolation between two hex code colors
function colorInterpolation( hex1, hex2, alpha)
{
	match1 = hex1.replace(/#/,'').match(/.{1,2}/g);
	r1 =parseInt(match1[0], 16); g1 = parseInt(match1[1], 16); b1 = parseInt(match1[2], 16);

	match2 = hex2.replace(/#/,'').match(/.{1,2}/g);
	r2 =parseInt(match2[0], 16); g2 = parseInt(match2[1], 16); b2 = parseInt(match2[2], 16);

	new_r = Math.round((r2 - r1 )*alpha + r1);
	new_g = Math.round((g2 - g1 )*alpha + g1);
	new_b = Math.round((b2 - b1 )*alpha + b1);
	return "rgb("+new_r+", "+ new_g+", "+new_b+")"
}

// Verify entropy minimum requirement
function notLazy( entropy )
{
	return (entropy > 0.65 * Math.log(entropyEpisode) )
}
// Create obstacles / points
function makeDiv(id, text, cl, proportion = 2) 
{
  var el;
  el = document.createElement("div");
  el.innerHTML = text;
  el.id = id;
  el.className = cl;
  
  // adapt size and color of obstacles according to gameplay
  if (cl == "object enemy" && proportion > 2)
  {
  	el.style.width = ( 30 + 5*(proportion-2) ) + "px";
	el.style.height = ( 30 + 5*(proportion-2) ) + "px";
	new_color = colorInterpolation("#99cc33","800000",1-Math.pow(0.83,proportion))
	el.style.background = "radial-gradient(circle at 30px 30px," + new_color + ", #000)";
  }
 
  document.body.appendChild(el);
  el.style.top = ( Math.floor(Math.random() * ( screenHeight - scoreHeight - el.offsetHeight ) ) + scoreHeight ) + "px"; // Only considers the center coordinates
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
    scoreCounter.style.visibility = "visible";
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
}

//game end
function gameEnd(defeat = true) {

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
  var proportion = 2 ; // proportion of obstacles and points

  loop = setInterval(function() 
  {

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
      // Smooth accerleration
      objects[x].style.left = objects[x].offsetLeft - (5 + speed ) + "px";

      // when objects colide with wasp
      if (collided(objects[x], wasp) == "hit"  ) {
        if (objects[x].className == "object enemy") {
          j = 0 , postDist = new Array( positions ).fill(0) // restart frequencies 
          gameEnd(defeat = true);
        }
        else{
          // keep playing to add points
          document.body.removeChild(objects[x]);
          score = score + 1 ;
          scoreCounter.innerHTML = score;
          //document.body.style.backgroundColor =  'rgba(135,93,61,' + (1-0.7*score/60) + ')';
        }
      }
      //remove unseen objects
      if (objects[x].offsetLeft < 0) {
      	document.body.removeChild(objects[x]);
      }
    }

    //accelerate objects every 2 seconds
    if (i == 120) {
      i = 0;
      if (speed < 20) {
        speed = speed + 1;
      }
    }
    // every 1/3 of a sec
    if (i % 19 === 0 && i !== 0) {

      // Record current position
      postDist[ (curY - scoreHeight) / stepSize ] += 1
      j += 1

      // Entropy calculation each 5 seconds
      if( j == entropyEpisode){
        entropy = EntropyCalculation( postDist , j )
        
        // Manipulate density of obstacles based on rew
	    proportion += notLazy(entropy) ? -2 : 1 ;
	    if ( proportion < 2 ) proportion = 2 ;
		
		// restart frequencies
        j = 0 , postDist = new Array( positions ).fill(0) 
      }

      if (i % proportion == 0 ){
        // Points (Honey)
        makeDiv("id", "", "object point");
      } else {
        //Enemies (Obstacles)
        makeDiv("id", "", "object enemy",proportion)
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