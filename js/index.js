let inputDir = {x: 0, y: 0}; 

let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeBodyArray = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};

// fadding function varibale 
const BOARD_OPACITY_REDUCTION_RATE = 0.02;
const BOARD_MIN_OPACITY = 0; // minimum opacity of the board is to be 0
const BOARD_MAX_OPACITY = 1; // maximum opacity of the board is to be 1
let boardCurrentOpacity = BOARD_MAX_OPACITY; // initialy the board opacity will be maximum meaning 1

// sound used in the game
const foodEatingSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const movingSound = new Audio('music/move.wav');
const backgroundMusicSound = new Audio('music/music.mp3');

const GAME_STATUS = {
    STARTED: "STARTED",
    GAME_OVER: "GAME_OVER",
}

let gameStatus = GAME_STATUS.GAME_OVER;

// for fps of the game
function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    mainGameFunction();
}

// various game ending conditions
function EndingGameFunction(snake) {
    for (let i = 1; i < snakeBodyArray.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){ // colliding with itself with the snake
            return true;
        }
    }
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){ // colliding with the boundry of the game
        return true;
    }
        
    return false; // no ending game condition
} 

// fadding various function
// making the game opacity to be minimum when the boards in not visible
function gameBoardDisappeared() {
    return boardCurrentOpacity == BOARD_MIN_OPACITY;
}
// game ending condition when the board opacity becomes zero
function shouldEndGame(snakeBodyArray) {
    return EndingGameFunction(snakeBodyArray) || gameBoardDisappeared();
}
// recduing the game boards opacity with the rate 
function reduceBoardOpacity() {
    updateBoardOpacity(boardCurrentOpacity - BOARD_OPACITY_REDUCTION_RATE);
}
// 
function updateBoardOpacity(opacity) {
    opacity = Math.min(Math.max(opacity, BOARD_MIN_OPACITY), BOARD_MAX_OPACITY);
    if (boardCurrentOpacity !== opacity) {
        boardCurrentOpacity = opacity;
        document.getElementById("board").style.opacity = opacity;
    }
}


function mainGameFunction(){

    // condition for game end
    if(shouldEndGame(snakeBodyArray)){

        gameStatus = GAME_STATUS.GAME_OVER;
        updateBoardOpacity(BOARD_MAX_OPACITY); // resetting the opacity
        gameOverSound.play();
        backgroundMusicSound.pause(); // pausing the background music because the game has ended
        
        inputDir =  {x: 0, y: 0}; 
        alert("Oops Turned In Late! Press any key to play again!"); // end game popup
        snakeBodyArray = [{x: 13, y: 15}]; // resetting the snake position after the game ends
        backgroundMusicSound.play();
        score = 0; 
    }
    // if food is eaten
    if(snakeBodyArray[0].y === food.y && snakeBodyArray[0].x ===food.x){
        foodEatingSound.play();

        updateBoardOpacity(BOARD_MAX_OPACITY); // resetting the opacity
        score += 1;
        if(score>hiscoreval){ // local storage for storing the highest score of the game
            hiscoreval = score; 
            localStorage.setItem("Highest Submission", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Highest Submission: " + hiscoreval;
        }

        // increment of the latest score
        scoreBox.innerHTML = "Assignments Submitted: " + score;
        snakeBodyArray.unshift({x: snakeBodyArray[0].x + inputDir.x, y: snakeBodyArray[0].y + inputDir.y}); // adding clone head body segment to the body of the snake 
        let a = 2; // grid number for spawing the food
        let b = 16;

        // new location of the food spawn
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())} // will just generate a random number between a and b 
    
    } else {
        if (gameStatus == GAME_STATUS.STARTED) {
            reduceBoardOpacity();
        }
    }

    for (let i = snakeBodyArray.length - 2; i>=0; i--) { // movement of the snake with just shifting the body segments one by one
        snakeBodyArray[i+1] = {...snakeBodyArray[i]};
    }

    snakeBodyArray[0].x += inputDir.x;
    snakeBodyArray[0].y += inputDir.y;
    board.innerHTML = "";

    // adding of the food in the body of the snake and displaying the snake
    snakeBodyArray.forEach((e, index)=>{
        
        snakeBodyElement = document.createElement('div');
        snakeBodyElement.style.gridRowStart = e.y;
        snakeBodyElement.style.gridColumnStart = e.x;
        
        if(index === 0){
            snakeBodyElement.classList.add('head');
        }
        else{
            snakeBodyElement.classList.add('snake');
        }
        board.appendChild(snakeBodyElement);
    });

    foodMainElement = document.createElement('div');
    foodMainElement.style.gridRowStart = food.y;
    foodMainElement.style.gridColumnStart = food.x;
    foodMainElement.classList.add('food')
    board.appendChild(foodMainElement);


}
// for score setting either null or the high score of the best game played
backgroundMusicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "Highest Submission: " + hiscore;
}

// for movement input from the user for the game
window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1}
    movingSound.play();
    if (gameStatus == GAME_STATUS.GAME_OVER) { // changing the game status because we want the opacity to be man in the starting of the game
        gameStatus = GAME_STATUS.STARTED;
    }

    switch (e.key) { // all the 4 arrow key movement input for the snake and ther respective effect in the movement in the game
        case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x = 0;
            inputDir.y = 1;
            break;
            
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }

});