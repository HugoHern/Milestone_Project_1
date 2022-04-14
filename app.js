//Canvas object to access content from the DOM
const context = document.querySelector('canvas').getContext('2d')
//Setting a set width and height for the canvas
context.canvas.height = 400
context.canvas.width = 1220

//uploading art assets for the main character
let dinoSpriteSheet = new Image()
dinoSpriteSheet.src = "/assets/blue-dino.png"
let dino = new gameSprite(dinoSpriteSheet, 
                            0,   //x position
                            0,   //y position
                            true,  //boolean for jumping
                            0,   //xvelocity
                            0,   //yvelocity
                            580, //width 
                            25,  //height   
                            17.0, // time(ms) duration between each frame change
                            24) // number of sprites in the spritesheet

//function to create our image for the character and animation using different frames in the spritesheet
function gameSprite(spritesheet, x, y, jumping, xVelocity, yVelocity, width, height, timePerFrame, numberOfFrames){
    this.spritesheet = spritesheet
    this.x = x
    this.y = y
    this.jumping = jumping
    this.xVelocity = xVelocity
    this.yVelocity = yVelocity
    this.width = width
    this.height = height
    this.timePerFrame = timePerFrame
    this.numberOfFrames = numberOfFrames || 1 //defaults to 1

    //current position in the sprite hseet
    this.frameIndex = 0
    //time that passed since the last time the sprite was updated using the built in Date object
    this.lastUpdate = Date.now()
    console.log(this.lastUpdate)
    //this function keep track of time passed since the last update and then moves to the next index of the frame if enough time has passed
    //and then starts the index back at 0 if the end of the frame index has been reached
    this.update = function(){
        if(Date.now() - this.lastUpdate >= this.timePerFrame){
            this.frameIndex++
        }
            if(this.frameIndex >= this.numberOfFrames){
                this.frameIndex = 0
            }
            this.lastUpdate = Date.now() //after the the function is ran, update the last update variable
    }
    //using the drawImage function of canvas to draw to the DOM whilte pass the context of canvas as a parameter
    this.draw = function(context){
        context.drawImage(this.spritesheet, 
                          this.frameIndex*this.width/this.numberOfFrames,
                          0,
                          this.width/this.numberOfFrames,
                          this.height,
                          this.x,
                          this.y,
                          this.width/this.numberOfFrames,
                          this.height)
    }


}
//declaring object which will represent the dino/character
/*const dino = {
    gameObject: dino,
    height: 32,
    width: 32,
    jumping: true,
    //the position of the dino
    x: 0,
    y: 0,
    //the speed of the dino
    xVelocity: 0,
    yVelocity: 0
}*/

//declaring object to control the dino/character
const controller ={
    //booleans decide which direction the dino is going
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


//main game loop to detect  key events and move dino position
const gameLoop = function(){
    //if dino is pressing up and is  not currently jumping, allow jump
    if (controller.up && dino.jumping == false){
        dino.yVelocity -=20
        dino.jumping = true
        console.log(dino.yVelocity)
    }
    //if dino is pressing left key, move left
    if (controller.left){
        dino.xVelocity -= 0.5
    }
    //if dino is pressing right key, move right
    if (controller.right){
        dino.xVelocity += 0.5
    }

    //adding gravity effect so character always falls back down
    dino.yVelocity += 1.5 // gravity
    //adding values to x and y to add acceleration
    dino.x += dino.xVelocity;
    dino.y += dino.yVelocity;
    //multiplying velocity properties to slow the character down
    dino.xVelocity *= 0.9 // friction
    dino.yVelocity *= 0.9 // friction

     // checking to see if the position of the dino object goes below the screen, while taking into account the dimensions of the actual dino objects dimensions
     //if the dino object does go past the bottom of screen, stop the dino's movement
    if (dino.y > 386 - 16 - 32) {
        dino.jumping = false
        dino.y = 386 - 16 - 32
        dino.yVelocity = 0
    }

    //if dino object goes past the left side of the screen, reset character to right side
    //if dino object goes past the right side of the screen, reset character to left side
    if (dino.x < -20) {
        dino.x = 1220
    } 
    else if (dino.x > 1220) {
        dino.x = -20
    }

     // Creates the background and dino using our canvas object and functions
    context.fillStyle = "#cdc1d4" //"#201A23"
    context.fillRect(0, 0, 1220, 400); // x, y, width, height
       // Creates and fills the cube for each frame
    context.fillStyle = "#4d8ef0"; // hex for cube color
    context.beginPath();
    context.rect(dino.x, dino.y, 25, 25);
    context.fill();
     // Creates the "ground"  or line for each frame
    context.strokeStyle = "#2E2532"
    context.lineWidth = 30
    context.beginPath()
    context.moveTo(0, 385)
    context.lineTo(1220, 385)
    context.stroke()

    //drawing the main character
    dino.update()

    //context.clearRect(0, 0, 1220, 400)
    dino.draw(context)
    // call update when the browser is ready to draw again, creates an infinite loop
    window.requestAnimationFrame(gameLoop)

}

//adding event listeners to check for key states and running the controller function
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener)
window.requestAnimationFrame(gameLoop)