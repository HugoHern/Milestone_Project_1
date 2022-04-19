//Canvas object to access content from the DOM
const context = document.querySelector('canvas').getContext('2d')
//Setting a set width and height for the canvas
context.canvas.height = 400
context.canvas.width = 1220

let gravity = 1.5  // global gravity variable for all game objects

//function to add background music 
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
}

//uploading background for the game
let backgroundImage = new Image()
backgroundImage.src = "/assets/battleback7.png"
let backgroundScreen = new gameSprite(backgroundImage, 0, 0, false, 0, 0 , 1220, 400, 0, 0)
console.log("background loaded")
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

//uploading art assets for  meteor objects
let meteorSpriteSheet = new Image()
meteorSpriteSheet.src = "/assets/meteors_3.png"
//array to keep track of meteors
let meteorArray = []     
let numberofMeteors = 5
for ( i = 0; i < numberofMeteors; i++){
    meteor = new gameSprite(meteorSpriteSheet, 0, 0, false, 0, 0, 800, 52, 1, 8)
    meteor.id = "meteor" + i // assigning a specific id to each meteor object
    meteor.x = Math.random() * 1220 // assign a random X position inside the game's width
    meteorArray.push(meteor)  //adding current meteor object to the meteor array
}

//function to create our games background with an uploaded image --- this function is never used
function gameBackground(width, height, color, x, y, type){
    this.type = type
    if (type == "image"){
        this.image = new Image()
        this.image.src = color
    }
    this.width = width
    this.height = height
    this.speedX = 0
    this.speedY = 0
    this.x = x
    this.y = y
    //using the drawImage function of canvas to draw to the DOM and pass the context of canvas as a parameter
    this.draw = function(){
        if (type == "image"){
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
        } else {
            context.fillStyle = color
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }


}

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
    //using the drawImage function of canvas to draw to the DOM and pass the context of canvas as a parameter
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

// function to detect collision between two objects
function detectCollision(object1, object2){
    let player = object1
    let object = object2

    let playerXRight = player.x + player.width
    let playerYBottom = player.y
    //console.log(playerXRight, playerYBottom)

    let objectXRight = object.x + object.width
    let objectYBottom = object.y + object.height
    //console.log(objectXRight, objectYBottom)

    const overlapX = (player.x == objectXRight && player.x == object.x) || 
                     (playerXRight == objectXRight && playerXRight == object.x)
    const overlapY = (player.y <= objectYBottom && player.y >= object.y) ||
                     (playerYBottom <= objectYBottom && playerYBottom >= object.y)

    let collision = overlapY
    if (collision){
        console.log("The player and the object collided")
    }
}
//main game loop to detect  key events and move dino position
const gameLoop = function(){
    //if player is pressing up and is  not currently jumping, allow jump
    if (controller.up && dino.jumping == false){
        dino.yVelocity -=20
        dino.jumping = true
    }
    //if plaer is pressing left key, move left
    if (controller.left){
        dino.xVelocity -= 0.5
    }
    //if player is pressing right key, move right
    if (controller.right){
        dino.xVelocity += 0.5
    }

    //adding gravity effect so character always falls back down
    dino.yVelocity += 1.5 // gravity
    for( let i = 0; i < meteorArray.length; i++){
        meteorArray[i].yVelocity += .02  //gravity
    }
    
    //adding values to x and y to add acceleration
    dino.x += dino.xVelocity
    dino.y += dino.yVelocity
    //loop through the meteor array and assign the velocity values
    for( let i = 0; i < meteorArray.length; i++){
        meteorArray[i].x += meteorArray[i].xVelocity
        meteorArray[i].y += meteorArray[i].yVelocity
    }
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
    // check to see if the meteor reaches the bottom of the play screen
    for ( let i = 0; i < meteorArray.length; i++){
        if (meteorArray[i].y > 386 - 16 - 32) {
        meteorArray[i].jumping = false
        meteorArray[i].y = 386 - 16 - 32
        meteorArray[i].yVelocity = 0
    }
}
    //if dino object goes past the left side of the screen, reset character to right side
    //if dino object goes past the right side of the screen, reset character to left side
    if (dino.x < -20) {
        dino.x = 1220
    } 
    else if (dino.x > 1220) {
        dino.x = -20
    }

       // Creates and fills the cube for each frame
    context.fillStyle = "#4d8ef0"; // hex for cube color
    context.beginPath();
    context.rect(dino.x, dino.y, 25, 25)
    context.fill()
    //creates a square for the meteor
    context.fillStyle = "#4d8ef0"; // hex for cube color
    context.beginPath();
    context.rect(meteor.x, meteor.y, 25, 25)
    context.fill()
     // Creates the "ground"  or line for each frame
    context.strokeStyle = "#2E2532"
    context.lineWidth = 30
    context.beginPath()
    context.moveTo(0, 385)
    context.lineTo(1220, 385)
    context.stroke()

    //drawing the main character / game objects
    backgroundScreen.update()
    dino.update()  //updating positin of the player
    context.clearRect(0, 0, 1220, 400)  //clear the canvas of any objects before going through the draw functions
    backgroundScreen.draw(context) //drawing the background
    dino.draw(context)  //drawing the player

    //loop through the meteor array and add or remove meteor objects to draw to canvas
    for ( let i = 0; i < meteorArray.length; i++){
        if (meteorArray.length > 1){
            meteorArray[i].update()
            meteorArray[i].draw(context)

            //code to check the collision between the meteors and the player
            detectCollision(dino, meteorArray[i])
        }
        if(meteorArray[i].yVelocity === 0){
            meteorArray.splice([i], 1) // if the meteor's yVelocity then the object has hit the ground and will be removed from game
        }
        if (meteorArray.length <= 1){
            meteorArray.push(new gameSprite(meteorSpriteSheet, 0, 0, false, 0, 0, 800, 52, 1, 8))
            console.log("new meteor added")
        }
        
    }
   
    // call update when the browser is ready to draw again, creates an infinite loop
    window.requestAnimationFrame(gameLoop)

}

let sadSong = new sound('/assets/bensound-sadday.mp3')
//sadSong.play()
//console.log(sadSong)
//adding event listeners to check for key states and running the controller function
window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener)
window.requestAnimationFrame(gameLoop)