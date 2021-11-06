let inputDir = {x: 0, y: 0}; 
const foodEatingSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.wav');
const musicSound = new Audio('music/music.mp3');
let speed = 19;
let score = 0;
let lastPaintTime = 0;
let snakeBodyArray = [
    {x: 13, y: 15}
];

food = {x: 6, y: 7};

const BOARD_OPACITY_REDUCTION_RATE = 0.02;
const BOARD_MIN_OPACITY = 0;
const BOARD_MAX_OPACITY = 1;
let boardCurrentOpacity = BOARD_MAX_OPACITY;

const GAME_STATUS = {
    STARTED: "STARTED",
    GAME_OVER: "GAME_OVER",
}

let gameStatus = GAME_STATUS.GAME_OVER;

function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    mainGameFunction();
}

function isCollide(snake) {
    for (let i = 1; i < snakeBodyArray.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

function gameBoardDisappeared() {
    return boardCurrentOpacity == BOARD_MIN_OPACITY;
}

function shouldEndGame(snakeBodyArray) {
    return isCollide(snakeBodyArray) || gameBoardDisappeared();
}

function reduceBoardOpacity() {
    updateBoardOpacity(boardCurrentOpacity - BOARD_OPACITY_REDUCTION_RATE);
}

function updateBoardOpacity(opacity) {
    opacity = Math.min(Math.max(opacity, BOARD_MIN_OPACITY), BOARD_MAX_OPACITY);
    if (boardCurrentOpacity !== opacity) {
        boardCurrentOpacity = opacity;
        document.getElementById("board").style.opacity = opacity;
    }
}

function mainGameFunction(){
    if(shouldEndGame(snakeBodyArray)){
        gameStatus = GAME_STATUS.GAME_OVER;
        updateBoardOpacity(BOARD_MAX_OPACITY);
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Oops Turned In Late! Press any key to play again!");
        snakeBodyArray = [{x: 13, y: 15}];
        musicSound.play();
        score = 0; 
    }

    if(snakeBodyArray[0].y === food.y && snakeBodyArray[0].x ===food.x){
        foodEatingSound.play();
        updateBoardOpacity(BOARD_MAX_OPACITY);
        score += 1;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("Highest Submission", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "Highest Submission: " + hiscoreval;
        }
        scoreBox.innerHTML = "Assignments Submitted: " + score;
        snakeBodyArray.unshift({x: snakeBodyArray[0].x + inputDir.x, y: snakeBodyArray[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    } else {
        if (gameStatus == GAME_STATUS.STARTED) {
            reduceBoardOpacity();
        }
    }

    for (let i = snakeBodyArray.length - 2; i>=0; i--) { 
        snakeBodyArray[i+1] = {...snakeBodyArray[i]};
    }

    snakeBodyArray[0].x += inputDir.x;
    snakeBodyArray[0].y += inputDir.y;
    board.innerHTML = "";
    snakeBodyArray.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}

musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "Highest Submission: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 1}
    moveSound.play();
    if (gameStatus == GAME_STATUS.GAME_OVER) {
        gameStatus = GAME_STATUS.STARTED;
    }
    switch (e.key) {
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