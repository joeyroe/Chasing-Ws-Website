//Game Board
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const gameBoardBackground = "magenta";
const scoreText = document.querySelector("#scoreText");
const highScoreText = document.querySelector("#highScoreText");

//Player
const playerSize = 25;
const playerColor = "aqua";
let playerX = gameWidth / 2; //starting position X
let playerY = gameHeight / 2; //starting positioin Y
let playerVelocityXLeft = 0;
let playerVelocityXRight = 0;
let playerVelocityY = 0;
let score = 0;

let highScoreStr = localStorage.getItem("highScoreKey");//highscore string
let highScore;

let w_sound = new Audio("assets/w_sound.m4a");
let l_sound = new Audio("assets/l_sound.m4a");

if(highScoreStr == null){ //first time playing game
    highScore = 0;
}
else{
    highScore = parseInt(highScoreStr); //sets highscore
}

//X and Y for the w
let wX;
let wY;

//properties for the Ls
let L_Width = 25;
let L_Height = L_Width * 7;
let bottomL_Width = L_Width * 4;
let L_Velocity = 1.5;

//[0]&[1] = top, [2]&[3] = bottom, [4] = left, [5] = right
let the_L_List = [setTopL_Pos(), setTopL_Pos(), setBottomL_Pos(), setBottomL_Pos(), setLeftL_Pos(), setRightL_Pos()]; //starting Ls

let gameOver = true;

drawBoard();
highScoreText.textContent = "High Score: " + highScore; //draw highscore

document.getElementById("startButton").onclick = function(){ //when the start button is pushed

    gameOver = false; //starts game
    scoreText.textContent = "W's: " + score; //writes score at zero again
    setW_Pos();
    update();
}

function update(){

    if(gameOver == false){
        
        ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
        playerX += playerVelocityXLeft;
        playerX += playerVelocityXRight;
        playerY += playerVelocityY;

        check_Overlapping_L_Top(the_L_List);
        check_Overlapping_L_Bottom(the_L_List);

        the_L_List[0][1] += L_Velocity; //moves top part of L down the screen
        the_L_List[0][3] += L_Velocity; //moves bottom part of L down the screen

        the_L_List[1][1] += L_Velocity; //same as the_L_List[0] ^^
        the_L_List[1][3] += L_Velocity; //same as the_L_List[0]

        the_L_List[2][1] -= L_Velocity; //moves top part of L up the screen
        the_L_List[2][3] -= L_Velocity; //moves bottom part of L up the screen

        the_L_List[3][1] -= L_Velocity; //same as the_L_List[2] ^^
        the_L_List[3][3] -= L_Velocity; //same as the_L_List[2]

        the_L_List[4][0] += L_Velocity; //moves top part of L to the right of the screen
        the_L_List[4][2] += L_Velocity; //moves bottom part of L to the right of the screen

        the_L_List[5][0] -= L_Velocity; //moves top part of L to the left of the screen
        the_L_List[5][2] -= L_Velocity; //moves bottom part of L to the left of the screen

        drawBoard();
        drawPlayer();

        //draw each L
        draw_L(the_L_List[0]);
        draw_L(the_L_List[1]);
        draw_L(the_L_List[2]);
        draw_L(the_L_List[3]);
        draw_L(the_L_List[4]);
        draw_L(the_L_List[5]);

        draw_W();

        checkCollision();
        checkHighScore(score);
        check_w_Collision();

        //check collisions with Ls
        for(let i = 0; i < the_L_List.length; i++){
            check_L_Collision(the_L_List[i][0], the_L_List[i][1], the_L_List[i][2], the_L_List[i][3]);
        }

        increase_L_Speed(score);

        //reset the L's when they leave the screen
        L_Leaves_Screen_Bottom(the_L_List);
        L_Leaves_Screen_Top(the_L_List);
        L_Leaves_Screen_Left(the_L_List);
        L_Leaves_Screen_Right(the_L_List);    
    
        requestAnimationFrame(update);
    }
}

function drawPlayer(){ //draws the player
    ctx.fillStyle = playerColor;
    ctx.fillRect(playerX, playerY, playerSize, playerSize);
}

function drawBoard(){ //draws the gameBoard
    ctx.fillStyle = gameBoardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function draw_W(){ //draws the W
    ctx.fillStyle = "white";
    ctx.font = "25px Impact";
    ctx.fillText("W", wX, wY);
}

//L is drawn with two rectangels, a vertical one and a horizontal one.
function draw_L(coordinates){

    ctx.fillStyle = "black";
    ctx.fillRect(coordinates[0], coordinates[1], L_Width, L_Height); //vertical
    ctx.fillRect(coordinates[2], coordinates[3], bottomL_Width, L_Width); //horizontal

}

//sets L above the playing screen, with a random X coordinate
function setTopL_Pos(){

    let LX = Math.floor(Math.random() * ((gameWidth - (bottomL_Width - 3)) - 3 + 1) + 3);
    let vertLY = -1 * (L_Height + 10);
    let horizLY = vertLY + L_Height;
    
    let coordinates = [LX, vertLY, LX, horizLY]; //x1, y1, x2, y2
    return coordinates;
}

//sets L below the playing screen, with a random X coordinate.
function setBottomL_Pos(){

    let LX = Math.floor(Math.random() * ((gameWidth - (bottomL_Width - 3)) - 3 + 1) + 3);
    let vertLY = gameHeight + 10;
    let horizLY = vertLY + L_Height;

    let coordinates = [LX, vertLY, LX, horizLY];
    return coordinates;
}

//sets L left of the playing screen with a random Y coordinate
function setLeftL_Pos(){

    let LX = -1 * (bottomL_Width + 10);
    let vertLY = Math.floor(Math.random() * ((gameHeight - (L_Height + L_Width)) - 3 + 1) + 3);
    let horizLY = vertLY + L_Height;

    let coordinates = [LX, vertLY, LX, horizLY];
    return coordinates;
}

//sets L right of the playing screen with a random Y coordinate
function setRightL_Pos(){

    let LX = gameWidth + (bottomL_Width);
    let vertLY = Math.floor(Math.random() * ((gameHeight - (L_Height + L_Width)) - 3 + 1) + 3);
    let horizLY = vertLY + L_Height;

    let coordinates = [LX, vertLY, LX, horizLY];
    return coordinates;
}

//when L leaves the screen from the bottom, reset the L position, put it back above the playing screen.
function L_Leaves_Screen_Bottom(coordinates){

    for(let i = 0; i < 2; i++){
        if(coordinates[i][1] > gameHeight){
            the_L_List[i] = setTopL_Pos();
        }
    }
}

//when L leaves the screen from the top, resett the L position, put it back below the playing screen.
function L_Leaves_Screen_Top(coordinates){

    for(let i = 2; i < 4; i++){
        if(coordinates[i][1] < (-1 * L_Height)){
            the_L_List[i] = setBottomL_Pos();
        }
    }
}

//When L leaves the screen from the right, reset the L position, put it bakc to the left of the playing screen.
function L_Leaves_Screen_Right(coordinates){

    if(coordinates[4][0] > gameWidth){
        the_L_List[4] = setLeftL_Pos();
    }
}

//When L leaves the screen from the left, reset the L position to the right of the screen.
function L_Leaves_Screen_Left(coordinates){

    if((coordinates[5][0] + bottomL_Width) < 0){
        the_L_List[5] = setRightL_Pos();
    }
}

//checks if Ls overlap coming in from the top resets them if they do
function check_Overlapping_L_Top(coordinates){

    let sweetSpot = bottomL_Width; //space between Ls
    
    if((coordinates[1][0] < (coordinates[0][0] + sweetSpot)) &&
    (coordinates[1][0] > coordinates[0][0])){

        coordinates[1][0] = coordinates[1][0] + sweetSpot;
        coordinates[1][2] = coordinates[1][0];
    }

    if((coordinates[1][0] > (coordinates[0][0] - sweetSpot)) && 
    (coordinates[1][0] < coordinates[0][0])){

        coordinates[1][0] = coordinates[1][0] - sweetSpot;
        coordinates[1][2] = coordinates[1][0];
    }
}

//checks if Ls overlap coming from the bottom, if they do resets them
function check_Overlapping_L_Bottom(coordinates){

    let sweetSpot = bottomL_Width; //space between Ls
    
    if((coordinates[3][0] < (coordinates[2][0] + sweetSpot)) &&
    (coordinates[3][0] > coordinates[2][0])){

        coordinates[3][0] = coordinates[3][0] + sweetSpot;
        coordinates[3][2] = coordinates[3][0];
    }

    if((coordinates[3][0] > (coordinates[2][0] - sweetSpot)) && 
    (coordinates[3][0] < coordinates[2][0])){

        coordinates[3][0] = coordinates[3][0] - sweetSpot;
        coordinates[3][2] = coordinates[3][0];
    }
}

//sets the W on a random position on the playing screen
function setW_Pos(){
    function randomW(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / playerSize) * playerSize; //random number within playing screen
        return randNum;
    }

    wX = randomW(25, gameWidth - playerSize);
    wY = randomW(25, gameHeight - playerSize);

    console.log("W X: ", wX);
    console.log("W Y: ", wY);
}


//checks if player collides with borders
function checkCollision(){ 

    //if player goes all the way to the botto of playing screen
    if(playerY >=  (gameBoard.height - (playerSize + 3))){
        playerY = gameBoard.height - (playerSize + 3);
    }
    
    //if player goes all the to the top of the playing screen
    if(playerY < 3){
        playerY = 3;
    }

    //if player goes all the way to the right of the playing screen
    if(playerX >= (gameBoard.width - (playerSize + 3))){
        playerX = (gameBoard.width) - (playerSize + 3);
    }

    //if player goes all the way to the left of the playing screen
    if(playerX < 3){
        playerX = 3;
    }
}

//when player collides with the W
function check_w_Collision(){

    //checks the x and y coordinates of both player and w, checks within range
    //if in range reset the w position.
    if(((wX - playerSize) <= playerX) && ((wX + playerSize) >= playerX) 
    && (wY - (playerSize * 2) <= playerY) && ((wY >= playerY))){

        score += 1; //update the score
        scoreText.textContent = "W's: " + score;
        setW_Pos(); //reset the position
        w_sound.play();
    }
}

//resets positions if player collides with an L
function check_L_Collision(top_LX_Pos, top_LY_Pos, bottom_LX_Pos, bottom_LY_Pos){//, bottom_LX_Pos, bottom_LY_Pos){

    
    if((playerX >= (top_LX_Pos - playerSize)) && (playerX <= (top_LX_Pos + L_Width)) && //touches sides of the L
    ((playerY >= top_LY_Pos) && ((playerY + playerSize) < (top_LY_Pos + L_Height)))){

        gameOver = true;
        playerX = gameWidth / 2;
        playerY = gameHeight / 2;
        the_L_List = [setTopL_Pos(), setTopL_Pos(), setBottomL_Pos(), setBottomL_Pos(), setLeftL_Pos(), setRightL_Pos()];
        score = 0; //reset score
        L_Velocity = 1.5; //reset speed
        l_sound.play();
        writeGameOver(); //display game over
    }
    
    /*
    if(((playerX + playerSize) >= top_LX_Pos) && (playerX <= top_LX_Pos + L_Width) &&
    (playerY >= top_LY_Pos) && ((playerY + playerSize) <= (top_LY_Pos + L_Height))){

        gameOver = true;
        playerX = gameWidth / 2;
        playerY = gameHeight / 2;
        the_L_List = [setTopL_Pos(), setTopL_Pos(), setBottomL_Pos(), setBottomL_Pos(), setLeftL_Pos(), setRightL_Pos()];
        score = 0; //reset score
        L_Velocity = 1.5; //reset speed
        writeGameOver(); //display game over
    }
    */
    if((playerX >= (bottom_LX_Pos - playerSize)) && (playerX <= (bottom_LX_Pos + bottomL_Width)) && //touches bottom of the L
    (playerY >= bottom_LY_Pos) && (playerY <= (bottom_LY_Pos + L_Width))){

        gameOver = true;
        playerX = gameWidth / 2;
        playerY = gameHeight / 2;
        the_L_List = [setTopL_Pos(), setTopL_Pos(), setBottomL_Pos(), setBottomL_Pos(), setLeftL_Pos(), setRightL_Pos()];
        score = 0;
        L_Velocity = 1.5;
        l_sound.play();
        writeGameOver();
    }

}

//increases the speed of the Ls based off the score increments of 10
function increase_L_Speed(score){

    if(score > 7){
        L_Velocity = 1.75;
    }

    if(score > 14){
        L_Velocity = 2;
    }

    if(score > 21){
        L_Velocity = 2.25;
    }

    if(score > 28){
        L_Velocity = 2.5;
    }
}

//checks if highscore has been beat, if so it updates the highscore
function checkHighScore(score){
    
    if(score > highScore){
        highScore = score;
        localStorage.setItem("highScoreKey", highScore);
        highScoreText.textContent = "High Score: " + highScore; //update highscore text.
    }
}

//writes Game Over on the canvas
function writeGameOver(){

    ctx.font = "50px Impact";
    ctx.fillStyle = "white";
    ctx.textAllign = "center";
    ctx.fillText("GAME OVER", (gameWidth / 2), (gameHeight / 2));
}