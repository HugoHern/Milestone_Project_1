//Canvas object to access content from the DOM
const context = document.querySelector('canvas').getContext('2d')
//Setting a set width and height for the canvas
context.canvas.height = 400
context.canvas.width = 1220

//declaring object which will represent the player/character
const player = {
    height: 32,
    width: 32,
    jumping: true,
    //the position of the player
    x: 0,
    y: 0,
    //the speed of the player
    xVelocity: 0,
    yVelocity: 0
}

//declaring object to control the player/character
const controller ={
    //booleans decide which direction the player is going
    left: false,
    right: false,
    up: false,

    //this property will use switch/case to detect events from the keyboard and adjust boolean properties
    keyListener: function (event) {
        let key_state = (event.type == "keydown") ? true : false;
        switch (event.keyCode) {
          case 37: // left arrow
            controller.left = key_state;
            break;
          case 38: // up arrow
            controller.up = key_state;
            break;
          case 39: // right arrow
            controller.right = key_state;
            break;
        }
    }
}


//main game loop to detect  key events and move player position
const gameLoop = function(){
    //if player is pressing up and is  not currently jumping, allow jump
    if (controller. up && player.jumping == false){
        player.yVelocity -=20
        player.jumping = true
    }
    //if player is pressing left key, move left
    if (controller.left){
        player.xVelocity -= 0.5
    }
    //if player is pressing right key, move right
    if (controller.right){
        player.xVelocity += 0.5
    }

    //adding gravity effect so character always falls back down
    player.yVelocity += 1.5 // gravity
    //adding values to x and y to add acceleration
    player.x += player.xVelocity;
    player.y += player.yVelocity;
    //multiplying velocity properties to slow the character down
    player.xVelocity *= 0.9 // friction
    player.yVelocity *= 0.9 // friction

     // checking to see if the position of the player object goes below the screen, while taking into account the dimensions of the actual player objects dimensions
     //if the player object does go past the bottom of screen, stop the player's movement
    if (player.y > 386 - 16 - 32) {
        player.jumping = false
        player.y = 386 - 16 - 32
        player.yVelocity = 0
    }

    //if player object goes past the left side of the screen, reset character to right side
    //if player object goes past the right side of the screen, reset character to left side
    if (player.x < -20) {
        player.x = 1220
    } 
    else if (player.x > 1220) {
        player.x = -20
    }

     // Creates the background and player using our canvas object and functions
    context.fillStyle = "#201A23";
    context.fillRect(0, 0, 1220, 400); // x, y, width, height
       // Creates and fills the cube for each frame
    context.fillStyle = "#8DAA9D"; // hex for cube color
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);
    context.fill();
     // Creates the "ground"  or line for each frame
    context.strokeStyle = "#2E2532";
    context.lineWidth = 30;
    context.beginPath();
    context.moveTo(0, 385);
    context.lineTo(1220, 385);
    context.stroke();

    // call update when the browser is ready to draw again, creates an infinite loop
    window.requestAnimationFrame(gameLoop)

}

//adding event listeners to check for key states and running calling the controller function
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener)
window.requestAnimationFrame(gameLoop)