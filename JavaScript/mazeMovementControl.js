addEventListener("keydown", function(e){

    let popped = false;

    if(e.code == 'ArrowRight'){
        
        if(gameOver == false){
        //won't allow currentIndex to move right if it is in the last column
            if((currentIndex % numOfCols) != (numOfCols - 1)){

                if(current.hasRightWall == false){
                    currentIndex += 1;
                    current = cellList[currentIndex];
                    
                    for(let i = 0; i < visitedList.length; i++){
                        
                        if(visitedList[i] == current){

                            drawBackGround(Number(visitedList[i + 1].x) + 2, Number(visitedList[i + 1].y) + 2, 
                                Number(visitedList[i + 1].cellWidth) - 4, Number(visitedList[i + 1].cellHeight) - 4, "magenta");
                            
                            visitedList.pop();
                            popped = true;
                        }
                    }
                    if(popped == false){
                        visitedList.push(current);

                        drawBackGround(Number(current.x) + 2, Number(current.y) + 2, 
                            Number(current.cellWidth) - 4, Number(current.cellHeight) - 4, "aqua");

                    }

                    if(current.cellNum == lastCell.cellNum){
                        gameOver = true;
                        drawEndGame(size / 8, size / 5, "black");
                        return;
                    }
                }
                
            }
        }
        
    }

    if(e.code == 'ArrowLeft'){
        
        if(gameOver == false){
        //won't allow currentIndex to move left if it is in the first column
            if((currentIndex % numOfCols) != 0){

                if(current.hasLeftWall == false){
                    currentIndex -= 1;
                    current = cellList[currentIndex];
                    
                    for(let i = 0; i < visitedList.length; i++){
            
                        if(visitedList[i] == current){
                            
                            drawBackGround(Number(visitedList[i + 1].x) + 2, Number(visitedList[i + 1].y) + 2, 
                                Number(visitedList[i + 1].cellWidth) - 4, Number(visitedList[i + 1].cellHeight) - 4, "magenta");
                            
                            visitedList.pop();
                            popped = true;
                        }
                    }
                    if(popped == false){
                        visitedList.push(current); 
                                                
                        drawBackGround(Number(current.x) + 2, Number(current.y) + 2, 
                            Number(current.cellWidth) - 4, Number(current.cellHeight) - 4, "aqua");  
                        
                    }

                    if(current.cellNum == lastCell.cellNum){
                        gameOver = true;
                        drawEndGame(size / 8, size / 5, "black");
                        return;
                    }
                }                
            }
        }
    }

    if(e.code == 'ArrowUp'){
        
        if(gameOver == false){
        //won't allow currentIndex to move up if it is in the first row.
            if(currentIndex >= numOfCols){

                if(current.hasTopWall == false){
                    currentIndex -= Number(numOfCols);
                    current = cellList[currentIndex];
                    
                    for(let i = 0; i < visitedList.length; i++){
                        
                        if(visitedList[i] == current){
                           
                            drawBackGround(Number(visitedList[i + 1].x) + 2, Number(visitedList[i + 1].y) + 2, 
                                Number(visitedList[i + 1].cellWidth) - 4, Number(visitedList[i + 1].cellHeight) - 4, "magenta");
                            
                            visitedList.pop();
                            popped = true;
                        }
                    }
                    if(popped == false){
                        visitedList.push(current);
                        
                        drawBackGround(Number(current.x) + 2, Number(current.y) + 2, 
                            Number(current.cellWidth) - 4, Number(current.cellHeight) - 4, "aqua");
                        
                    }

                    if(current.cellNum == lastCell.cellNum){
                        gameOver = true;
                        drawEndGame(size / 8, size / 5, "black");
                        return;
                    }                   
                }            
            }
        }
    }

    if(e.code == 'ArrowDown'){
        
        if(gameOver == false){
        //won't allow currentIndex to move down if it is in the last row.
            if(((numOfCols * numOfRows) - numOfCols) > currentIndex){

                if(current.hasBottomWall == false){
                    currentIndex += Number(numOfCols);
                    current = cellList[currentIndex];
                    
                    for(let i = 0; i < visitedList.length; i++){
                        
                        if(visitedList[i] == current){
                            
                            drawBackGround(Number(visitedList[i + 1].x) + 2, Number(visitedList[i + 1].y) + 2, 
                                Number(visitedList[i + 1].cellWidth) - 4, Number(visitedList[i + 1].cellHeight) - 4, "magenta");
                            
                            visitedList.pop();
                            popped = true;
                        }
                    }
                    if(popped == false){
                        visitedList.push(current);
                       
                        drawBackGround(Number(current.x) + 2, Number(current.y) + 2, 
                            Number(current.cellWidth) - 4, Number(current.cellHeight) - 4, "aqua");
                        
                    }

                    if(current.cellNum == lastCell.cellNum){
                        gameOver = true;
                        drawEndGame(size / 8, size / 5, "black");
                        return;
                    }                   
                }
            }
        }
    }
});