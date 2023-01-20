//Здесь находится всё то, чем игрок может изменить ход вещей
export default class inputManager{
	static keyboard = { //undefined - нажата любая клавиша кроме зарегистрированных
    }

    static bindings = {
        // RIGHT_ARROW: "rightArrPressed",
        // LEFT_ARROW: "leftArrPressed",
        // UP_ARROW: "upArrPressed",
        // DOWN_ARROW: "downArrPressed",
        // SPACE: "spacePressed"
        32: "spacePressed",
        37: "leftArrPressed",
        39: "rightArrPressed"
    }
    static mouse = {
        gameWorldPosition: {x: 0, y: 0},
        chunkPosition: {x: 0, y: 0},
        chunkPosOnScreen: {x: 0, y: 0},
        posInChunks: {x: 0, y: 0},
        interactRadius: 60,
    }

    static start(){
        noCursor();
    }
    static update(){
        if(mouseIsPressed || true){
            inputManager.updateMouse();
        }

        //circle(mouseX, mouseY, 20)
    }

    static updateMouse(){
        inputManager.mouse.gameWorldPosition.x = (mouseX - gameWorld.camera.offset.x)/gameWorld.camera.zoom + gameWorld.camera.position.x;
        inputManager.mouse.gameWorldPosition.y = (mouseY - gameWorld.camera.offset.y)/gameWorld.camera.zoom + gameWorld.camera.position.y;
        inputManager.mouse.chunkPosition.x = inputManager.mouse.gameWorldPosition.x - inputManager.mouse.gameWorldPosition.x%gameWorld.chunkSizeWidth;
        inputManager.mouse.chunkPosition.y = inputManager.mouse.gameWorldPosition.y - inputManager.mouse.gameWorldPosition.y%gameWorld.chunkSizeHeight;
        inputManager.mouse.posInChunks.x = (inputManager.mouse.gameWorldPosition.x - inputManager.mouse.gameWorldPosition.x%gameWorld.chunkSizeWidth) / gameWorld.chunkSizeWidth;
        inputManager.mouse.posInChunks.y = (inputManager.mouse.gameWorldPosition.y - inputManager.mouse.gameWorldPosition.y%gameWorld.chunkSizeHeight) / gameWorld.chunkSizeHeight;
        //circle(inputManager.mouse.chunkPosition.x, inputManager.mouse.chunkPosition.y, 20);
        inputManager.mouse.chunkPosOnScreen.x = (inputManager.mouse.chunkPosition.x - gameWorld.camera.position.x)*gameWorld.camera.zoom + gameWorld.camera.offset.x;
        inputManager.mouse.chunkPosOnScreen.y = (inputManager.mouse.chunkPosition.y - gameWorld.camera.position.y)*gameWorld.camera.zoom + gameWorld.camera.offset.y;
        //rect(inputManager.mouse.chunkPosOnScreen.x, inputManager.mouse.chunkPosOnScreen.y, 20, 20);
        //circle(inputManager.mouse.chunkPosition.x - gameWorld.camera.position.x + gameWorld.camera.offset.x + gameWorld.chunkSizeWidth/2, inputManager.mouse.chunkPosition.y - gameWorld.camera.position.y + gameWorld.camera.offset.y + gameWorld.chunkSizeHeight/2, 20)
        //circle((mx - mx%gameWorld.chunkSizeWidth) - gameWorld.camera.position.x + gameWorld.camera.offset.x + gameWorld.chunkSizeWidth/2, (my - my%gameWorld.chunkSizeHeight) - gameWorld.camera.position.y + gameWorld.camera.offset.y + gameWorld.chunkSizeHeight/2, 20)
    }

    static draw(){
        if(mouseIsPressed){
            push();
            fill(90, 120, 90, 60);
            stroke(100, 100, 230);
            rect(inputManager.mouse.chunkPosOnScreen.x, inputManager.mouse.chunkPosOnScreen.y, gameWorld.chunkSizeWidth*gameWorld.camera.zoom, gameWorld.chunkSizeHeight*gameWorld.camera.zoom);
            pop();
        }
        push();
        fill(200, 200, 100);
        circle(mouseX, mouseY, 20);
        pop();
    }

    static getPressed(key){

    }

    static getPushed(key){

    }

    static getRaised(key){

    }

    static getClicked(key){

    }
}

function mouseWheel(event){
    // let oldZoom = zoom;
    // zoom += event.delta / 1000;
    // console.log(event.delta, zoom);
    // if(zoom > maxZoom){zoom = maxZoom}
    // if(zoom < minZoom){zoom = minZoom}
    // if(oldZoom != zoom){
        // renderNoise();
        // render();
    // }


    let dir = event.delta/Math.abs(event.delta);
    gameWorld.changeCameraZoom(dir);


    // scaleRect(cameraRect, map(event.delta / 100, - 100, 100, 0, 200));
    // updateSlicesOnScreen();

    return false;
}
window.mouseWheel = mouseWheel;

function mouseDragged(){
    if(mouseIsPressed){
    // mapOffsetX += movedX;
    // mapOffsetY += movedY;
    // cameraRect.x -= movedX / (width / cameraRect.w);
    // cameraRect.y -= movedY / (height / cameraRect.h);
    gameWorld.camera.position.x -= movedX / gameWorld.camera.zoom;
    gameWorld.camera.position.y -= movedY / gameWorld.camera.zoom;
    // render();
    }
    // console.log(mapOffsetX);
}
window.mouseDragged = mouseDragged;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
window.windowResized = windowResized;

function keyPressed(){
    inputManager.keyboard[inputManager.bindings[keyCode]] = true;
    if(keyCode == 114){DEBUG_MODE = !DEBUG_MODE;};
    if(keyCode != 116 && keyCode != 122 && keyCode != 123){ //116-f5, 122 - f11, 123-f12, 
        return false;
    }
}
window.keyPressed = keyPressed;

function keyReleased(){
    inputManager.keyboard[inputManager.bindings[keyCode]] = false;
    return false;
}
window.keyReleased = keyReleased;

// function mouseClicked(event) {
//   console.log(event);
//   console.log(mouseX);
//   rect(0, mouseX, 100, 100)
//   image(images.Village, mouseX, mouseY)
// }