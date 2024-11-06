class mazeCell{

    constructor(cellNum, cellHeight, cellWidth, x, y){
        this.cellNum = cellNum;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        this.x = x;
        this.y = y;

        this.wallList = [];
        this.wallCoordList = [];

        this.hasTopWall = false;
        this.hasBottomWall = false;
        this.hasRightWall = false;
        this.hasLeftWall = false;
    }


    /*
    Below are all of the setters
    */
    setCellNum(cellNum){
        this.cellNum = cellNum;
    }

    setCellHeight(cellHeight){
        this.cellHeight = cellHeight;
    }

    setCellWidth(cellWidth){
        this.cellWidth = cellWidth;
    }

    setX(x){
        this.x = x;
    }

    setY(y){
        this.y = y;
    }

    /*
    add walls to wall-list and adds wall coordinates to
    wall-coordinates list.
    */
   addWall(wall){
    this.wallList.push(wall);
   }

   addWallCoord(wallCoord){
    this.wallCoordList.push(wallCoord);
   }
}