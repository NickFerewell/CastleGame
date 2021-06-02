// var castles = [];
// var routes = [];

// var growSpeed = 1; //0.75, 1
// var growUnit = 1;

const FPS = 60;

var gameWorld;
var DEBUG_MODE = false;
var images = {};

function preload(){
    // Config.imagePaths.forEach(function(path, name){
    //     images[name] = loadImage(path);
    // })
    Object.keys(Config.imagePaths).forEach(function(nameOfImage) {
        images[nameOfImage] = loadImage(Config.imagePaths[nameOfImage] || Config.imagePaths.__default);
});
}

function setup(){
    createCanvas(windowWidth, windowHeight);

    frameRate(FPS);

    // castles = generateCastles(7);
    // console.log(castles);

    gameWorld = new World();
    gameWorld.start();
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
    gameWorld.draw();
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