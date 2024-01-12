addEventListener("keydown", function(e){

    if(e.code == 'ArrowRight'){
        playerVelocityXRight = 5;
    }

    if(e.code == 'ArrowLeft'){
        playerVelocityXLeft = -5;
    }

    if(e.code == 'ArrowUp'){
        playerVelocityY = -5;
    }

    if(e.code == 'ArrowDown'){
        playerVelocityY = 5;
    }
});

addEventListener("keyup", function(e){

    if(e.code == 'ArrowRight'){
        playerVelocityXRight = 0;
        console.log("Player X: ", playerX);
    }

    if(e.code == 'ArrowLeft'){
        playerVelocityXLeft = 0;
        console.log("Player X: ", playerX);
    }

    if(e.code == 'ArrowUp'){
        playerVelocityY = 0;
        console.log("Player Y: ", playerY);
    }

    if(e.code == 'ArrowDown'){
        playerVelocityY = 0;
        console.log("Player Y: ", playerY);
    }
});
