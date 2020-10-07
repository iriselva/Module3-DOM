// VARIABLES

const boardBorder = 'black';
const boardBackground = "white";
const wormCol = 'pink';
const wormBorder = 'black';
let count = 0;
let intervalID;
let canStartGame = true;
let speed = 100;
let gamePlayIntervalID;
let highscore;


let worm = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]

let score = 0;
// true if changing direction
let changingDirection = false;
// horizontal move
let foodX;
let foodY;
let dx = 10;
// vertical move
let dy = 0;

// Get the canvas element from html
const wormboard = document.getElementById("wormboard");
// Return a two dimensional drawing context
const wormboardCtx = wormboard.getContext("2d");

// MAIN FUNCTION

// called repeatedly to keep the game running
const main = () => {
    gamePlayIntervalID = setInterval(function onTick() {
        if (hasGameEnded()) {
            stopGame()
        }
        changingDirection = false;
        clearCanvas();
        drawFood();
        drawWorm();
        moveWorm();
    }, speed)
};


// GAME BOARD

// draw a border around the canvas
const clearCanvas = () => {
  //  Select the colour to fill the drawing
  wormboardCtx.fillStyle = boardBackground;
  //  Select the colour for the border of the canvas
  wormboardCtx.strokestyle = boardBorder;
  // Draw a "filled" rectangle to cover the entire canvas
  wormboardCtx.fillRect(0, 0, wormboard.width, wormboard.height);
  // Draw a "border" around the entire canvas
  wormboardCtx.strokeRect(0, 0, wormboard.width, wormboard.height);
};

// Draw one worm part
const drawWormPart = (wormPart) => {
    // colour of the worm part
    wormboardCtx.fillStyle = wormCol;
    // border colour of the worm part
    wormboardCtx.strokestyle = wormBorder;
    // Draw a "filled" rectangle to represent the worm part at the coordinates
    // the part is located
    wormboardCtx.fillRect(wormPart.x, wormPart.y, 10, 10);
    // Draw a border around the worm part
    wormboardCtx.strokeRect(wormPart.x, wormPart.y, 10, 10);
  };

// Draw the worm on the canvas
const drawWorm = () => worm.forEach(drawWormPart);

// drawing the food on the canvas
const drawFood = () => {
      wormboardCtx.fillStyle = 'lightgreen';
      wormboardCtx.strokestyle = 'darkgreen';
      wormboardCtx.fillRect(foodX, foodY, 10, 10);
      wormboardCtx.strokeRect(foodX, foodY, 10, 10);
};

const createCanvas = () => {
    clearCanvas();
    drawFood();
    drawWorm();
};

// calling the game board
createCanvas();

// boundarys to game canvas to see if game has ended
const hasGameEnded = () => {
    for (let i = 4; i < worm.length; i++) {   
        // check to see if head collides with bodypart
        if (worm[i].x === worm[0].x && worm[i].y === worm[0].y) return true;
    } // check for boundary walls
    const hitLeftWall = worm[0].x < 0;
    const hitRightWall = worm[0].x > wormboard.width -10;
    const hitTopWall = worm[0].y < 0;
    const hitBottomWall = worm[0].y > wormboard.height -10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
};

// randomly generate an x and y coordinate for the foods positon
const randomFood = (min, max) => {  
   return Math.round((Math.random() * (max-min) + min) / 10) * 10;
};

const genFood = () => {  
    // generating random number x and y
   foodX = randomFood(0, wormboard.width - 10);
   foodY = randomFood(0, wormboard.height - 10);
    // generate a new location if food is eaten
   worm.forEach(function hasWormEatenFood(part) {
        const hasEaten = part.x == foodX && part.y == foodY;
        if (hasEaten) {
           genFood(); 
        } 
      });
};


// KEYBOARD AND CONTROLS

// using the arrow keys to change direction of worm
const handleKeyDown = (event) => {
    // setting each key
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE_BAR = 32;

    // preventing worm from reversing
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;
    
    if (keyPressed === LEFT_KEY && !goingRight)
    {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown)
    {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft)
    {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp)
    {
        dx = 0;
        dy = 10;
    }
    if (keyPressed === SPACE_BAR)
    {
        stopGame();
        start();
    }    
};

// the document listens to if a key on keyboard is pressed
document.addEventListener("keydown", handleKeyDown);

// making the worm move horizontaly and adding score
const moveWorm = () => {  
    // new head for worm 
   const head = {x: worm[0].x + dx, y: worm[0].y + dy};
   // adding the new head
   worm.unshift(head);
   const hasEatenFood = worm[0].x === foodX && worm[0].y === foodY;
   if(hasEatenFood) {
       // increase score
       score += 10;
       document.getElementById('score').innerHTML = score;
       // new food location
       genFood();
   } else {
       // removing the last element
        worm.pop();
   }
 };


// TIMER AND BUTTON

 // getting the ids from html for time and button
 const timeDisplay = document.getElementById("time-display");
 const startButton = document.getElementById("start-button");

 // adding event to button to start game
 startButton.addEventListener("click", function() { 
    if (canStartGame) {
        start();
    }
 });

 
 // when the game stops 
 const stopGame = () => {
     clearInterval(gamePlayIntervalID);
     clearInterval(intervalID);
     canStartGame = true;
     // if there is a highscore set an alert
     if (score > highscore) {
         localStorage.setItem('wormHighscore', score);
         setHighscore();
         alert('New highscore! ' + score);
     }
 };

// setting local storage to keep highscore
 const setHighscore = () => {
    highscore = localStorage.getItem('wormHighscore') || 0;
    document.getElementById('highscore').innerHTML = highscore;
 };

 setHighscore();

 // when pressing start we reset the board
 const start = () => {
    reset();
    canStartGame = false;
    intervalID = setInterval(function () {
        count += 1;
        timeDisplay.textContent = count;
    }, 1000);
    main();
    genFood();
 };

 // resetting the game boart by calling intial variables
 const reset = () => {
    worm = [
        {x: 200, y: 200},
        {x: 190, y: 200},
        {x: 180, y: 200},
        {x: 170, y: 200},
        {x: 160, y: 200}
    ]
    // variables
    count = 0;
    score = 0;
    // true if changing direction
    changingDirection = false;
    // horizontal move
    foodX;
    foodY;
    dx = 10;
    // vertical move
    dy = 0;
    document.getElementById('score').innerHTML = score;
    timeDisplay.textContent = count;
    clearInterval(gamePlayIntervalID);
 };






