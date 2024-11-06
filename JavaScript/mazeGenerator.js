let size; //height and width of the maze
let numOfRows;
let numOfCols;

let cellSet; //disjoint set of cells

let cellList; //list of all of the cells
let cellHeight;
let cellWidth;

let wallList;
let wallCoordList;

let current; //the current cell that is being visited
let currentIndex; //index of current cell

let visitedList; //list of cells that have been visited.

let maxSize = 950; //max size of the maze
let minSize = 400; //minimum size of the maze

let maxNumOfCols = 65; //max number of columns allowed in maze
let minNumOfCols = 3; //minimum number of columns allowed in maze

let maxNumOfRows = 65;
let minNumOfRows = 3;

let gameOver; //is gameover yes or no (true or false)

let mazeBoard = document.querySelector("#mazeBoard");
let ctx = mazeBoard.getContext("2d");

let lastCell; //the finish line, last cell in the list
let wSize; //the size of the W in the last cell.


document.getElementById("mazeStartButton").onclick = function(){ //when start button is clicked

    let tempSize = document.getElementById("mazeSize").value;
    let tempNumOfRows = document.getElementById("rowsAndCols").value;
    let tempNumOfCols = document.getElementById("rowsAndCols").value;

    let validInput = checkUserInput(tempSize, tempNumOfRows, tempNumOfCols);//true if input is valid false otherwise

    if(validInput == true){
        gameOver = false;
        size = tempSize;
        numOfRows = tempNumOfRows;
        numOfCols = tempNumOfCols;
        mazeBoard.height = size;
        mazeBoard.width = size;

        cellHeight = size / numOfCols;
        cellWidth = size / numOfRows;

        wSize = cellHeight * 0.8;
        
        cellSet = disjointSet(numOfRows, numOfCols);
        cellList = buildCellList(numOfRows, numOfCols, cellHeight, cellWidth);
        setCellListX(cellList, numOfCols, cellWidth);
        setCellListY(cellList, numOfRows, cellHeight);

        wallList = generateWallList(Number(numOfRows), Number(numOfCols));
        wallCoordList = generateWallCoords(Number(numOfRows), Number(numOfCols), cellWidth, cellHeight);
        removeWalls(cellSet, wallList, wallCoordList);

        populateCellWalls(cellList, wallList, wallCoordList);
        setCellWalls(cellList);

        currentIndex = 0;
        current = cellList[currentIndex];
        visitedList = [current];
        lastCell = cellList[cellList.length - 1];

        drawMaze(wallCoordList, size, "magenta");
        drawVisitedList(visitedList, "aqua");
        drawW(wSize, lastCell, "white");
    }
}


/*
checks to make sure user input values are between the minimums and maximums set
returns false if input is invalid, returns true if input is valid
*/
function checkUserInput(sizeInput, rowsInput, colsInput){

    if(sizeInput < minSize){
        alert("Minimum size is " + minSize);
        return false;
    }

    if(sizeInput > maxSize){
        alert("Maximum size is " + maxSize);
        return false;
    }

    if((rowsInput < minNumOfRows) && (colsInput < minNumOfCols)){
        alert("Minimum number of rows/columns is " + minNumOfCols);
        return false;
    }

    if((rowsInput > maxNumOfRows) && (colsInput > maxNumOfCols)){
        alert("Maximum number of rows/columns is " + maxNumOfCols);
        return false;
    }
    
    return true;
}


/*
returns initial disjoint set with -1s representing each set
*/
function disjointSet(numOfRows, numOfCols){

    let set = [];
    for(i = 0; i < (numOfRows * numOfCols); i++){
        set.push(-1);
    }

    return set;
}

/*
returns the root of setItem in the cellSet
*/
function findRoot(cellSet, setItem){

    if(cellSet[setItem] < 0){ //anything less than 0 is a root
        return setItem;
    }

    let root = findRoot(cellSet, cellSet[setItem]);
    cellSet[setItem] = root;
    return root;
}


/*
returns the number of sets/roots in cellSet
*/
function numOfSets(cellSet){

    let sets = 0;
    for(i = 0; i < cellSet.length; i++){
        if(cellSet[i] < 0){
            sets += 1;
        }
    }

    return sets;
}


/*
joins 2 sets together that aren't already joined
set2 is gets the root of set1.
*/
function union(cellSet, set1, set2){

    let root1 = findRoot(cellSet, set1); //root of set1
    let root2 = findRoot(cellSet, set2); //root of set2

    if(root1 != root2){
        cellSet[root2] = root1;
    }
}


/*
returns an initial list of cells using the number of rows and columns
*/
function buildCellList(numOfRows, numOfCols, cellHeight, cellWidth){
    
    let cellList = [];
    for(i = 0; i < (numOfRows * numOfCols); i++){
        let tempCell = new mazeCell(i, cellHeight, cellWidth);
        cellList.push(tempCell);
    }

    return cellList;
}


/*
sets the x-coordinate point for each cell in cellList
*/
function setCellListX(cellList, numOfCols, cellWidth){

    let temp = 0;

    for(i = 0; i < cellList.length; i++){
        if((i % numOfCols) == 0){ //How I know the row has eneded
            temp = 0; //reset temp back to zero.
        }
        cellList[i].setX((temp * cellWidth)); //set the x-coordinate for each cell.
        temp += 1;
    }
}


/*
sets the y-coordinate point for each cell in cellList
*/
function setCellListY(){

    let temp = 0; 

    for(i = 0; i < cellList.length; i++){

        //end of each row after the first row increases temp by 1
        if((i > 0) && ((i % numOfRows) == 0)){
            temp += 1;
        }
        cellList[i].setY(temp * cellHeight); //use cellHeight to set Y-coord
    }
}


/*
returns a list of walls using the cell numbers ex.) [0, 1]
*/
function generateWallList(numOfRows, numOfCols){

    wallList = [];
    let cell = 0;

    for(i = 0; i < numOfRows; i++){
        for(j = 0; j < numOfCols; j++){

            cell = j + (i * numOfCols);

            if(j != numOfCols - 1){
                wallList.push([cell, cell + 1]);
            }

            if(i != numOfRows - 1){
                wallList.push([cell, cell + numOfCols]);
            }
        }
    }

    return wallList;
}


/*
returns a list of wall-coordinate points for the wall list
*/
function generateWallCoords(numOfRows, numOfCols, cellWidth, cellHeight){

    wallCoordinates = [];
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    for(let i = 0; i < numOfRows; i++){
        for(let j = 0; j < numOfCols; j++){

            //when j is on the last column and i isn't on the last row
            if((j == (numOfCols - 1)) && (i != (numOfRows - 1))){
                
                x1 = cellWidth * j;
                y1 = cellHeight * (i + 1);
                x2 = cellWidth * (j + 1);
                y2 = cellHeight * (i + 1);

                wallCoordinates.push([x1, y1, x2, y2]);
            }

            //when i is on the last row and j isn't on the last column
            else if((i == (numOfRows - 1)) && (j != (numOfCols - 1))){
                
                x1 = cellWidth * (j + 1);
                y1 = cellHeight * i;
                x2 = cellWidth * (j + 1);
                y2 = cellHeight * (i + 1);

                wallCoordinates.push([x1, y1, x2, y2]);
            }

            //when i isn't the last row and j isn't the last column
            else if((i < (numOfRows - 1)) && (j < (numOfCols - 1))){ 

                //I create and push the vertical wall coordinate points before the horizontal coordinate points for indexing reasoning
                //indices of coordinate points will match up with indices of the wall list
                
                //sets the vertical walls coordinate points
                x1 = cellWidth * (j + 1);
                y1 = i * cellHeight;
                x2 = cellWidth * (j + 1);
                y2 = cellHeight * (i + 1);

                wallCoordinates.push([x1, y1, x2, y2]); //push vertical wall coordinates to stack

                //sets the horizontal wall coordinate points
                x1 = cellWidth * j;
                y1 = cellHeight * (i + 1);
                x2 = cellWidth * (j + 1);
                y2 = cellHeight * (i + 1);

                wallCoordinates.push([x1, y1, x2, y2]); //push horizontal wall coordinates to stack.
            }
        }
    }

    return wallCoordinates;
}



/*
a random wall is selected, it is then checked if the two cells in the wall share the same root.
if not, they are joined, and this goes on until there is only one root/set. when 2 sets are joined
the wall is popped from the wall list and the wall-coordinate points are popped from the wall-coordinate list.
*/
function removeWalls(cellSet, wallList, wallCoordList){

    while(numOfSets(cellSet) > 1){

        let randomIndex = Math.floor(Math.random() * (wallList.length - 1));
        let randomWall = wallList[randomIndex];

        if(findRoot(cellSet, randomWall[0]) != findRoot(cellSet, randomWall[1])){
            union(cellSet, randomWall[0], randomWall[1]);
            wallList.splice(randomIndex, 1);
            wallCoordList.splice(randomIndex, 1);
        }
    }
}


/*
populates the individual cell's wall-list and wall-coordinates list.
*/
function populateCellWalls(cellList, wallList, wallCoordList){

    for(i = 0; i < wallList.length; i++){
        for(j = 0; j < wallList[i].length; j++){

            cellList[wallList[i][j]].addWall(wallList[i]);
            cellList[wallList[i][j]].addWallCoord(wallCoordList[i]);
        }
    }
}



/*
sets true values if cells have right/left/bottom/top walls, since all walls come set false from default.
*/
function setCellWalls(cellList){

    for(i = 0; i < cellList.length; i++){
        for(j = 0; j < cellList[i].wallList.length; j++){

            if(cellList[i].cellNum == cellList[i].wallList[j][0]){
                if(cellList[i].cellNum + 1 == cellList[i].wallList[j][1]){
                    cellList[i].hasRightWall = true;
                }
                if(Number(cellList[i].cellNum) + Number(numOfCols) == Number(cellList[i].wallList[j][1])){
                    cellList[i].hasBottomWall = true;
                }
            }

            if(cellList[i].cellNum == cellList[i].wallList[j][1]){
                if(cellList[i].cellNum - 1 == cellList[i].wallList[j][0]){
                    cellList[i].hasLeftWall = true;
                }
                if(cellList[i].cellNum - numOfCols == cellList[i].wallList[j][0]){
                    cellList[i].hasTopWall = true;
                }
            }
        }
    }
}


//fills the background color of the given coordinates.
function drawBackGround(x1, y1, x2, y2, backgroundColor){
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x1, y1, x2, y2);
}

//fills the visitedList with the given color.
function drawVisitedList(visitedList, cellColor){
    for(i = 0; i < visitedList.length; i++){
        drawBackGround(Number(visitedList[i].x) + 2, Number(visitedList[i].y) + 2, 
        Number(visitedList[i].cellWidth) - 4, Number(visitedList[i].cellHeight) - 4, cellColor);
    }
}

/*
draws a wall
*/
function drawWall(x1, y1, x2, y2){

    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

}

/*
draws all of the walls with using the wallCoordsList
*/
function drawMaze(wallCoordList, size, backgroundColor){

    drawBackGround(0, 0, size, size, backgroundColor);
    for(i = 0; i < wallCoordList.length; i++){
        drawWall(wallCoordList[i][0], wallCoordList[i][1], wallCoordList[i][2], 
            wallCoordList[i][3]);
    }
}


function drawW(wSize, lastCell, color){

    ctx.fillStyle = color;
    let fontSize = wSize.toString();
    fontSize = fontSize + "px";
    ctx.font = fontSize + " Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
    ctx.fillText("W", lastCell.x + (cellWidth/4), lastCell.y + (cellHeight - 2))
}


function drawEndGame(x, y, color){

    ctx.fillStyle = color;
    ctx.font = "85px Impact, Hattenschweiler, 'Arial Narrow Bold', sans-serif";
    ctx.fillText("You've Won!", x, y);
}