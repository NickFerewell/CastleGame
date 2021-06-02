//Здесь находится всё то, чем игрок может изменить ход вещей
class inputManager{
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


    dir = event.delta/Math.abs(event.delta);
    gameWorld.changeCameraZoom(dir);


    // scaleRect(cameraRect, map(event.delta / 100, - 100, 100, 0, 200));
    // updateSlicesOnScreen();

    return false;
}

function mouseDragged(){
    if(mouseIsPressed){
    // mapOffsetX += movedX;
    // mapOffsetY += movedY;
    // cameraRect.x -= movedX / (width / cameraRect.w);
    // cameraRect.y -= movedY / (height / cameraRect.h);
    gameWorld.camera.position.x -= movedX;
    gameWorld.camera.position.y -= movedY;
    // render();
    }
    // console.log(mapOffsetX);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed(){
    inputManager.keyboard[inputManager.bindings[keyCode]] = true;
    if(keyCode == 114){DEBUG_MODE = !DEBUG_MODE;};
    if(keyCode != 116 && keyCode != 122 && keyCode != 123){ //116-f5, 122 - f11, 123-f12, 
        return false;
    }
}

function keyReleased(){
    inputManager.keyboard[inputManager.bindings[keyCode]] = false;
    return false;
}