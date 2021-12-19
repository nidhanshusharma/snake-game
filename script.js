var canvas = document.querySelector("canvas");
var c = canvas.getContext("2d");

var size = (window.innerHeight - 100) / 20;
var dim = {
    rows:20,
    columns:20
};

if(window.innerWidth < 758 || window.innerHeight < 768){
    size = (window.innerWidth - 40) / 20;
}

console.log(window.innerWidth);

var w = canvas.width = size * dim.rows;
var h = canvas.height = size * dim.columns;
var score = 0;
var speed = 10;
var level = 1;

var userName = "";
var gameState = 0;

grid = [];

var head = {
    x:10,
    y:10
};

var food = {
    x:8,
    y:8
};

var velocity = {
    x:0,
    y:0
};

var parts = [];
var taillength = 2;

function clearScreen(){
    c.fillStyle = "#000";
    c.fillRect(0,0,w,h);
}

class Part{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

var biteSound = new Audio("audio/bite.wav");
biteSound.volume = 0.5;
biteSound.playbackRate = 1.5;

function drawSnake(){

    for(let i = 0;i<parts.length;i++){
        let n = parts[i];
        c.fillStyle = "white";
        // c.strokeStyle = "white";
        c.fillRect(n.x * size,n.y * size, size, size);
    }
    parts.push(new Part(head.x,head.y));
    while(parts.length > taillength){
        parts.shift();
    }

    c.fillStyle = "white";
    c.strokeStyle = "#333";
    c.fillRect(head.x * size,head.y * size,size,size);
    c.strokeRect(head.x * size,head.y * size,size,size);
}

function createGrid(){
    for(let i=0;i<dim.rows;i++){
        grid[i] = [];
        for(let j=0;j<dim.columns;j++){
            grid[i][j] = {
                x:0,
                y:0
            };
            grid[i][j].x = grid[i][j].x + size * j;
            grid[i][j].y = grid[i][j].y + size * i;
            c.strokeStyle = "#111";
            c.strokeRect(grid[i][j].x,grid[i][j].y,size,size);
        }
    }
}

var levelUpSound = new Audio("audio/level.mp3");

function onFoodBite(){
    if(food.x === head.x && food.y === head.y){
        food.x = Math.floor(Math.random()*dim.rows);
        food.y = Math.floor(Math.random()*dim.columns);
        taillength++;
        score+= 10;
        if(score % 50 == 0){
            levelUpSound.play();
            document.getElementById("toast").style.display = "block";
            document.getElementById("toast").classList.add("animate-toast");
            setTimeout(()=>{
                document.getElementById("toast").classList.remove("animate-toast");
                document.getElementById("toast").style.display = "none";
            },1010);
            speed+=3;
            level++;
        }
        biteSound.play();
    }
    // console.log("yes");
}

function drawGameOver() {
    removeEventListener("keypress",()=>{});
    document.querySelector("#game-over").classList.remove("remove-modal");
    document.querySelector(".dark").classList.remove("remove-dark");
    document.querySelector(".dark").style.display="block";
    document.querySelector("#game-over").style.display = "flex";
    document.querySelector("#gameover-score").innerHTML = ""+score;
    document.querySelector("#gameover-username").innerHTML = " "+userName;
    printLeaderBoard();
    if(localStorage.getItem(userName+"-score")){
        localStorage.setItem(userName+"-score",score);
    }
    // c.font = size*2 +"px verdana";
    // c.fillStyle = "rgba(0,0,0,0.7)";
    // c.fillRect(0,0,w,h);
    // c.fillStyle = "white";
    // c.fillText("Game Over!",w/2 - size*4 - size,h/2);
}

function isGameOver() {
    let gameOver = false;

    if(velocity.x === 0 && velocity.y === 0){
        return false;
    }

    if(head.x * size < 0){
        gameOver = true;
    }
    if(head.x * size > (dim.rows - 1) * size){
        gameOver = true;
    }
    if(head.y * size < 0){
        gameOver = true;
    }
    if(head.y * size > (dim.columns - 1) * size){
        gameOver = true;
    }

    for(let i=0;i<parts.length;i++){
        let n = parts[i];
        if(n.x == head.x && n.y == head.y){
            gameOver = true;
            break;
        }
    }

    if(gameOver){
        drawGameOver();
    }
    return gameOver;
}

function changeSnakePosition() {
    head.x = head.x + velocity.x;
    head.y = head.y + velocity.y;
}

function drawFood(){
    c.beginPath();
    c.shadowColor = "white";
    c.shadowBlur = 10;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = "red";
    c.arc(food.x * size + size / 2,food.y * size + size / 2,size / 2,0,2 * Math.PI);
    c.fill();
    c.beginPath();
    c.shadowColor = "white";
    c.shadowBlur = 20;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = "red";
    c.arc(food.x * size + size / 2,food.y * size + size / 2,size / 2,0,2 * Math.PI);
    c.fill();
    c.beginPath();
    c.shadowColor = "red";
    c.shadowBlur = 30;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = "red";
    c.arc(food.x * size + size / 2,food.y * size + size / 2,size / 2,0,2 * Math.PI);
    c.fill();
    c.beginPath();
    c.shadowColor = "red";
    c.shadowBlur = 40;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.fillStyle = "red";
    c.arc(food.x * size + size / 2,food.y * size + size / 2,size / 2,0,2 * Math.PI);
    c.fill();
    c.shadowColor = "red";
    c.shadowBlur = 0;
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowColor = "orange";
}

function restartGame() {
    grid = [];

    head = {
        x:10,
        y:10
    };

    food = {
        x:8,
        y:8
    };

    velocity = {
        x:0,
        y:0
    };

    parts = [];
    taillength = 2;
    speed = 10;
    score = 0;
    clearTimeout(timeoutId);
    document.querySelector("#game-over").classList.add("remove-modal");
    document.querySelector(".dark").classList.add("remove-dark");
    setTimeout(()=>{
        document.querySelector("#game-over").classList.remove("remove-modal");
        document.querySelector(".dark").classList.remove("remove-dark");
        document.querySelector("#game-over").style.display="none";
        document.querySelector(".dark").style.display="none";
    },360);
    animate();
}

function checkForRestart(){
    window.addEventListener("keypress",(e)=>{
        if(e.key === " "){
            restartGame();
        }
    });
}

function printLeaderBoard() {
    let data = getLocalStorageData();
    let dataDiv = document.querySelector("#data");
    if(data.keys.length !== 0){
        let str = "";
        for(let i=0;i<data.keys.length - 1;i+=2){
            str += `
                <li>`+data.values[i]+`: `+data.values[i+1]+`</li>`;
        }
        dataDiv.innerHTML = str;
    }else{
        dataDiv.innerHTML = "<h4>No Leaderboard Data to display<h4>";
    }
}

var timeoutId;

function animate(){
    changeSnakePosition();
    if(isGameOver()){
        checkForRestart();
        return;
    }
    clearScreen();
    createGrid();

    drawFood();
    onFoodBite();
    drawSnake();
    updateScore();
    timeoutId = setTimeout(animate,1000/speed);
}

function updateScore() {
    document.querySelector("#score").innerHTML = ""+score;
    document.querySelector("#level").innerHTML = ""+level;
}

animate();

function easyMode() {
    speed = 10;
}

function mediumMode() {
    speed = 15;
}

function hardMode() {
    speed = 20;
}

var form = document.querySelector("form");
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    skipStart();
    userName = form.name.value;
    localStorage.setItem(form.name.value+"-user",form.name.value);
    localStorage.setItem(form.name.value+"-score",score);
});

document.querySelector("#skip").addEventListener("click",skipStart);
document.querySelector("#skip").addEventListener("active",skipStart);

function skipStart() {
    document.querySelector("#start-screen").classList.add("remove-modal");
    document.querySelector(".dark").classList.add("remove-dark");
    setTimeout(()=>{
        document.querySelector("#start-screen").classList.remove("remove-modal");
        document.querySelector(".dark").classList.remove("remove-dark");
        document.querySelector("#start-screen").style.display="none";
        document.querySelector(".dark").style.display="none";
    },360);
    addEventListener("keydown",(e)=>{
        if(e.key === "w" || e.key === "ArrowUp"){
            if(velocity.y == 1){
                return;
            }
    
            velocity.x = 0;
            velocity.y = -1;
        }
        if(e.key === "s" || e.key === "ArrowDown"){
            if(velocity.y == -1){
                return
            }
            velocity.x = 0;
            velocity.y = 1;
        }
    
        if(e.key === "a" || e.key === "ArrowLeft"){
            if(velocity.x == 1){
                return
            }
            velocity.x = -1;
            velocity.y = 0;
        }
        if(e.key === "d" || e.key === "ArrowRight"){
            if(velocity.x == -1){
                return
            }
            velocity.x = 1;
            velocity.y = 0;
        }
    });
    document.querySelector("#m-up").addEventListener("click",()=>{
        if(velocity.y == 1){
            return;
        }

        velocity.x = 0;
        velocity.y = -1;
    });
    document.querySelector("#m-down").addEventListener("click",()=>{
        if(velocity.y == -1){
            return
        }
        velocity.x = 0;
        velocity.y = 1;
    });
    document.querySelector("#m-left").addEventListener("click",()=>{
        if(velocity.x == 1){
            return
        }
        velocity.x = -1;
        velocity.y = 0;
    });
    document.querySelector("#m-right").addEventListener("click",()=>{
        if(velocity.x == -1){
            return
        }
        velocity.x = 1;
        velocity.y = 0;
    });
}

// console.log(localStorage);
document.querySelector("#play-again").addEventListener("click",restartGame);
document.querySelector("#play-again").addEventListener("active",restartGame);

function getLocalStorageData() {
    let localData = [];
    keys = Object.keys(localStorage);
    
    for(let i = 0;i<keys.length;i++){
        localData.push(localStorage.getItem(keys[i]));
    }
    return {keys:keys,values:localData};
}