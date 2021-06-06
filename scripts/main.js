// var castles = [];
// var routes = [];

// var growSpeed = 1; //0.75, 1
// var growUnit = 1;

const FPS = 60;

var gameWorld;
var DEBUG_MODE = false;
const standartImageWidth = 100;
const standartImageHeight = 50;

var images = {
}; //map картинок класса 5p.image

function preload(){
    // Config.imagePaths.forEach(function(path, name){
    //     images[name] = loadImage(path);
    // })
    Object.keys(Config.imagePaths).forEach(function(nameOfImage) {
        images[nameOfImage] = loadImage(Config.imagePaths[nameOfImage]/* || Config.imagePaths.Default*/);
    });
}

function setup(){
    Object.keys(images).forEach(function(nameOfImage) {
        images[nameOfImage].resize(standartImageWidth, 0);  //w = w * k k = std/w
    });

    createCanvas(windowWidth, windowHeight);

    frameRate(FPS);

    // castles = generateCastles(7);
    // console.log(castles);

    gameWorld = new World();
    gameWorld.start();
    inputManager.start();
    GUIManager.start();
}

function draw(){
    background(210);
    
    // for(var i = 0; i < castles.length; i++){
    //     castles[i].draw();
    // }

    // for(var i = 0; i < castles.length; i++){
    //     castles[i].update();
    // }

    gameWorld.update();
    inputManager.update();
    GUIManager.update();

    gameWorld.draw();
    inputManager.draw();
    GUIManager.draw();
}


/*
function generateCastles(num){
    var castles = [];

    for(var i = 0; i < num; i++){
        castles.push(new Castle(Math.round(random(0, 10)) * (width/20), random(0, height), random(0, 4)));
    }

    return castles;
}
*/