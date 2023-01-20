//import * from './buildings.js';
// import {Delaunay} from "d3-delaunay";
import createBuildingByName from "./buildings.js";
import * as buildings from "./buildings.js"
import inputManager from "./inputManager.js";
import GUIManager from "./GUIManager.js";
import Utilities from "./utilities.js";

export default class World {
	constructor(){
		this.Empires = [];
		this.MapOfRelief = [];
		this.Buildings = [];
		this.Entities = [];
		this.camera = { //Должен быть реализован прямоугольник(произвольный) камеры для того, чтобы рисовать только постройки в зоне видимости
			position: {x: width/2, y: height/2}, //x: 0, y: 0
			zoom: 1,
			offset: {x: width/2, y: height/2}, //x: width/2, y: height/2
			zoomDelta: 0.01,
			minZoom: 0.2, 
			maxZoom: 5,
		};
		this.seed = 2; //7060, 94717, 6831(четыре горы), 9720, 3583
		this.mapByChunks = [];
		this.chunkSizeWidth = 30; //30
		this.chunkSizeHeight = 30; //30
		this.chunkAmountWide = 100; //100
		this.chunkAmountHigh = 60; //60
		this.CellMapByChunks = [];
	}

	changeCameraZoom(dir, mult = 1){
        this.camera.zoom = Utilities.clamp(this.camera.zoom + dir * this.camera.zoomDelta * mult, this.camera.minZoom, this.camera.maxZoom);
    }

	start(){
		//this.createBuilding("Village", {x: 80, y: 80}, [Config.professions[2]]);
		//this.createBuilding("Castle", {x: 200, y: 160}, [Config.professions[0]]);
		this.createWorld();
	}

	createWorld(){ //procedurally generate new world
		//const points = [[0, 0], [0, 1], [1, 0], [1, 1]];
		var points = [];

		this.seed = prompt("Введи сид, ;Ю.\n" + "Текущий сид: " + this.seed, Math.floor(random()*100000));
		randomSeed(this.seed);
		noiseSeed(this.seed);

		console.log(this.chunkSizeWidth*this.chunkAmountWide)

		const cellAndPointsNum = 800; //300, 100, 200 - это количество точек(клеток) на всей карте. А концентрация этих точек это cellAndPointsNum / this.chunkSizeWidth*this.chunkAmountWide. Кол-во точек/количество пикселей. сколько точек в одном пикселе. Идеальная концентрация это 0.06(6) - 200/3000
		for(var i = 0; i < cellAndPointsNum; i++){
			points.push([random(this.chunkSizeWidth*this.chunkAmountWide), random(this.chunkSizeHeight*this.chunkAmountHigh)]);
		}
		// for (var i = 0; i < 2; i++) {
		// 	points = this.improveRandomPoints(points);
		// }

		for(var x = 0; x < this.chunkAmountWide; x++){
			var yCollumn = []
			for(var y = 0; y < this.chunkAmountHigh; y++){
				yCollumn.push([]);
			}
			this.mapByChunks.push(yCollumn);
		}
		for(var x = 0; x < this.chunkAmountWide; x++){
			var yCollumn = []
			for(var y = 0; y < this.chunkAmountHigh; y++){
				yCollumn.push([]);
			}
			this.CellMapByChunks.push(yCollumn);
		}

		this.makeRelaxed(points);
		const delaunay = d3.Delaunay.from(points);
		const voronoi = delaunay.voronoi([0, 0, this.chunkSizeWidth*this.chunkAmountWide, this.chunkSizeHeight*this.chunkAmountHigh]); //960, 500
		const cellPolygons = voronoi.cellPolygons();
		for (let cell of cellPolygons) {
			//cell.color = Utilities.getRandomCSSColor();
			var cellCentroid = this.findCentroidOfPolygonArrays(cell);
			var heightOfTheCell = noise(cellCentroid[0], cellCentroid[1])
			var cellColor = this.getColorOfHeightMapSmoothHex(heightOfTheCell); //noise()*2 - 1

			var readyCell = {bounds: cell, centroid: {x: cellCentroid[0], y: cellCentroid[1]}, height: heightOfTheCell, color: cellColor};

  			this.MapOfRelief.push(readyCell);


			var topLeftX = Infinity;
			var topLeftY = -Infinity;
			var botRightX = -Infinity;
			var botRightY = Infinity;
			// console.log(readyCell)
			for(var i = 0; i < readyCell.bounds.length; i++){
				const vert = readyCell.bounds[i];
				topLeftX = Math.min(topLeftX, vert[0]);
				topLeftY = Math.max(topLeftY, vert[1]);
				botRightX = Math.max(botRightX, vert[0]);
				botRightY = Math.min(botRightY, vert[1]);
			}
			// console.log(topLeftX, topLeftY, botRightX, botRightY)

			topLeftX = this.getCoordInChunksX(topLeftX);
			topLeftY = this.getCoordInChunksY(topLeftY);
			botRightX = this.getCoordInChunksX(botRightX);
			botRightY = this.getCoordInChunksY(botRightY);
			// console.log(topLeftX, topLeftY, botRightX, botRightY);

			for (let x = topLeftX; x < botRightX; x++) {
				for (let y = botRightY; y < topLeftY; y++) {
					this.CellMapByChunks[x][y].push(readyCell);
					// console.log(this.CellMapByChunks[x][y]);
				}
			}
		}

		this.createCastlesAndRuins(this.MapOfRelief);
	}

	update(){
		this.Buildings.forEach(function(building){
            building.update();
        });

        //Код для определения выделенного мышкой объекта. Далее вокруг него рисуется GUI в GUIManager.update()
        if(mouseIsPressed){
        	var chx = inputManager.mouse.posInChunks.x;
        	var chy = inputManager.mouse.posInChunks.y;
	        //if(this.mapByChunks[chx][chy].length != 0){
	        	//console.log('hit!');
	        	//GUIManager.selectedObject = this.mapByChunks[chx][chy][this.mapByChunks[chx][chy].length - 1];
	        	const numChuncksToCheck = (inputManager.mouse.interactRadius - inputManager.mouse.interactRadius%this.chunkSizeWidth)/this.chunkSizeWidth + 1;
	        	var neighboursCells = Utilities.getNeighbours(this.mapByChunks, chx, chy, numChuncksToCheck);
	        	//console.log(numChuncksToCheck**2);
	        	neighboursCells.push(this.mapByChunks[chx][chy]);
	        	var neighbours = [];
	        	for(var i = 0; i < neighboursCells.length; i++){
	        		if(neighboursCells[i] !== undefined){
		        		for(var j = 0; j < neighboursCells[i].length; j++){
		        			neighbours.push(neighboursCells[i][j]);
		        		}
	        		}
	        	}
	        	//console.log(neighboursCells, neighbours);
	        	var distances = [];
	        	for(var k = 0; k < neighbours.length; k++){
	        		var distance = Utilities.Dist(neighbours[k].position, inputManager.mouse.gameWorldPosition);
	        		if(distance <= inputManager.mouse.interactRadius){
	        			distances.push({obj: neighbours[k], dist: distance});
	        		}
	        	}

	        	var minDist = {obj: null, dist: 100};
	        	for(var l = 0; l < distances.length; l++){
	        		if (distances[l].dist <= minDist.dist){
	        			minDist.obj = distances[l].obj;
	        			minDist.dist = distances[l].dist;
	        		}
	        	}
	        	GUIManager.selectedObject = minDist.obj;
	        	//console.log(GUIManager.selectedObject, minDist, distances);
	        //}
    	}
	}

	draw(){
		this.drawRelief(); //drawMap
		this.drawBuildings();
		if(DEBUG_MODE){this.drawChunkBorders();}
	}

	drawBuildings(){
		this.Buildings.forEach(function(building){
            building.draw();
        });
	}

	drawRelief(){
		/*var topLeftX = Math.max(this.screenToWorldCoordX(0), 0);
		var topLeftY = Math.max(this.screenToWorldCoordY(0), 0);
		var botRightX = Math.min(this.screenToWorldCoordX(this.camera.offset.x*2), this.chunkAmountWide*this.chunkSizeWidth);
		var botRightY = Math.min(this.screenToWorldCoordY(this.camera.offset.y*2), this.chunkAmountHigh*this.chunkSizeHeight);

		// console.log(topLeftX, topLeftY, botRightX, botRightY);
		topLeftX = this.getCoordInChunksX(topLeftX);
		topLeftY = this.getCoordInChunksY(topLeftY);
		botRightX = this.getCoordInChunksX(botRightX);
		botRightY = this.getCoordInChunksY(botRightY);
		// console.log(topLeftX, topLeftY, botRightX, botRightY);
		// console.log(this.CellMapByChunks)

		var CellsToDraw = [];
		push();
		translate(-this.camera.position.x*this.camera.zoom + this.camera.offset.x, -this.camera.position.y*this.camera.zoom + this.camera.offset.y);
		scale(this.camera.zoom);
		stroke(200, 200, 100);
		for (let x = topLeftX; x < botRightX; x++) {
			for (let y = topLeftY; y < botRightY; y++) {
				for (let i = 0; i < this.CellMapByChunks[x][y].length; i++) {
					const CellToDraw = this.CellMapByChunks[x][y][i];
					if(!(CellToDraw in CellsToDraw)){
						CellsToDraw.push(CellToDraw);	
					
						fill(CellToDraw.color);
						beginShape();
						for(let vert of CellToDraw.bounds){
							vertex(vert[0], vert[1]);
						}
						endShape(CLOSE);
					}
				}
			}
		}
		pop(); */

		
		push();
		translate(-this.camera.position.x*this.camera.zoom + this.camera.offset.x, -this.camera.position.y*this.camera.zoom + this.camera.offset.y);
		scale(this.camera.zoom);
		stroke(200, 200, 100);
		for (let cell of this.MapOfRelief) {
			fill(cell.color);
			beginShape();
  			for(let vert of cell.bounds){
  				vertex(vert[0], vert[1]);
  			}
  			endShape(CLOSE);
  		}
  		pop();
		
	}

	createCastlesAndRuins(mapOfRelief){
		//const tempBuildings = voronoi.circumcenters;
		const tempBuildings = [];
		for (var i = mapOfRelief.length - 1; i >= 0; i--) {
			if(this.getTypeOfCellOfHeight(mapOfRelief[i].height) != "вода"){ //Изменить на функцию получитьМожноЛиСтроитьНаЭтомТайле()
				tempBuildings.push(mapOfRelief[i].centroid);
			}
			//console.log();
		}
		//console.log(tempBuildings);
		for(var i = 0; i < tempBuildings.length; i++){
			var building = tempBuildings[i];
			//console.log(i, building)
			switch (Math.floor(random(4))) {
				case 0:
					this.createBuilding("Ruins", building);
					break;
				case 1:
					this.createBuilding("Village", building, buildings.TestVillage.getRandomStartPopulation());
					break;
				case 2:
					//На этом месте на карте будет пустое место для сражений, полей, лесов, озёр, гор и т.д.
					break;
				case 3:
					this.createBuilding("Castle", building, buildings.TestVillage.getRandomStartPopulation());
					break;
				default:
					//do nothing
					break;
			}
		}
	}

	getCellAtPos(position){
		return resultCell;
	}

	getTypeOfCellOfHeight(height, biome){
		if(height >= 0.99) {/*облака, гигантские заснеженные горы*/ return "облака"} else
		if(height > 0.9){/*mountain tops*/return "вершины гор"} else 
		if(height > 0.75){/*mountains*/ return "горы"} else
		if(height > 0.5){/*леса*/ return "леса"} else
		if(height > 0.40){/*плоскогорье, низ горы*/ return "равнины"} else
		if(height > 0){/*равнины*/ return "вода"} else
		{/*бедрок?*/ return "выжженные земли"}
	}

	getColorOfHeightMap(height){ //height от -1 до 1
		/*switch (height) {
			case >=0.99:
				//облака, гигантские заснеженные горы
				return "white"
			case > 0.9:
				//mountain tops
				return "WhiteSmoke"
			case > 0.75:
				//mountains
				return "SaddleBrown"
				break;
			case > 0.5:
				//плоскогорье, низ горы
				return "SandyBrown"
			case > 0.2:
			 	//леса
			 	return "ForestGreen"
			case > 0:
				//равнины
				return "LawnGreen"
			case > -0.1:
				//прибрежные зоны
				return "LightYellow"
			case > -0.3:
				//моря
				return "RoyalBlue"
			case > -0.6:
				//океаны
				return "DarkBlue"
			case > -0.9:
				//глубокие океаны
				return "DarkViolet"
			case >= -1:
				//марианские впадины, глубоководные разломы
				return "Violet"
			default:
				//бедрок?
				return "Black"
				break;
		}*/
		if(height >= 0.99) {/*облака, гигантские заснеженные горы*/ return "white"} else
		if(height > 0.9){/*mountain tops*/return "WhiteSmoke"} else 
		if(height > 0.75){/*mountains*/ return "SaddleBrown"} else
		if(height > 0.5){/*плоскогорье, низ горы*/ return "SandyBrown"} else
		if(height > 0.2){/*леса*/ return "ForestGreen"} else
		if(height > 0){/*равнины*/ return "LawnGreen"} else
		if(height > -0.1){/*прибрежные зоны*/ return "LightYellow"} else
		if(height > -0.3){/*моря*/ return "RoyalBlue"} else
		if(height > -0.6){/*океаны*/ return "DarkBlue"} else
		if(height > -0.9){/*глубокие океаны*/ return "DarkViolet"} else
		if(height > -1){/*марианские впадины, глубоководные разломы*/return "Violet"} else
		{/*бедрок?*/ return "Black"}
	}

	getColorOfHeightMapSmooth(height){ //height от 0 до 1 - более большие переходы
		if(height >= 0.99) {/*облака, гигантские заснеженные горы*/ return "white"} else
		if(height > 0.9){/*mountain tops*/return "WhiteSmoke"} else 
		if(height > 0.75){/*mountains*/ return "SaddleBrown"} else
		if(height > 0.5){/*леса*/ return "ForestGreen"} else
		if(height > 0.40){/*плоскогорье, низ горы*/ return "lightgreen"} else
		if(height > 0){/*равнины*/ return "LawnGreen"} else
		{/*бедрок?*/ return "Black"}
	}
	
	getColorOfHeightMapSmoothHex(height){ //height от 0 до 1 - более большие переходы
		if(height >= 0.99) {/*облака, гигантские заснеженные горы*/ return "WhiteSmoke"} else
		if(height > 0.9){/*mountain tops*/return "#d6a36e"} else 
		if(height > 0.75){/*mountains*/ return "#a18c76"} else
		if(height > 0.5){/*леса*/ return "#7fbf7f"} else
		if(height > 0.40){/*плоскогорье, низ горы*/ return "#a1d66e"} else
		if(height > 0){/*равнины*/ return "#7fbfbf"} else
		{/*бедрок?*/ return "Black"}
	}

	/*improveRandomPoints(startPoints){ //Не работает
		var delaunay = d3.Delaunay.from(startPoints);
		var voronoi = delaunay.voronoi([0, 0, width, height]);
		var points = delaunay.points;
		var centroids = voronoi.circumcenters;
		for (var i = 0; i < points.length; i++) {
			points[i] = centroids[i];
		}
		return points;
	}*/


	/*  // Improve the random set of points with Lloyd Relaxation
  	static generateRelaxed(size, seed) {
	    return function(numPoints){
	      	var i, p, q, voronoi, region;
	      	var points = generateRandom(size, seed)(numPoints);
	      	for (i = 0; i < NUM_LLOYD_RELAXATIONS; i++) {
	        	voronoi = new Voronoi(points, null, new Rectangle(0, 0, size, size));
	        	for (let p of points) {
		            region = voronoi.region(p);
		            p.x = 0.0;
		            p.y = 0.0;
		            for each (q in region) {
		                	p.x += q.x;
		                	p.y += q.y;
		              	}
		            p.x /= region.length;
		            p.y /= region.length;
		            region.splice(0, region.length);
		          }
	        	voronoi.dispose();
	      }
	      return points;
		}
	}*/

	makeRelaxed(points){
		//var newPoints;
		const NUM_LLOYD_RELAXATIONS = 3;
		const relaxationPower = -1; //from 0 to 1. (-1; 1) p<0 - relax, p>0 - converge
		for (var i = 0; i < NUM_LLOYD_RELAXATIONS; i++) {
			console.log(i)
        	var voronoi = d3.Delaunay.from(points).voronoi([0, 0, this.chunkSizeWidth*this.chunkAmountWide, this.chunkSizeHeight*this.chunkAmountHigh]);
        	for (var j = 0; j < points.length; j++) {
	            var cell = voronoi.cellPolygon(j);
	            //console.log('cell ', cell, j, i);
	            var centroid = this.findCentroidOfPolygonArrays(cell);
	            //console.log("centroid", centroid);
	            //points[j] = Utilities.Add(points[j], Utilities.Mult(Utilities.Sub(points[j], centroid), relaxationPower));
	            points[j] = [points[j][0] + relaxationPower*(points[j][0]-centroid[0]), points[j][1] + relaxationPower*(points[j][1]-centroid[1])];
	            //console.log('point', points[j])
	            //console.log(cell, centroid, points[j])
	        }
        	voronoi.update();
	    }
	    return points;
	}

	findCentroidOfPolygonObjects(points){
		var cx = 0;
		var cy = 0;
		points.forEach( function(point) {
			cx += point.x;
			cy += point.y;
		});
		cx /= points.length;
		cy /= points.length;
		return {x: cx, y: cy};
	}

	findCentroidOfPolygonArrays(points){
		var cx = 0;
		var cy = 0;
		points.forEach( function(point) {
			cx += point[0];
			cy += point[1];
		});
		cx /= points.length;
		cy /= points.length;
		return [cx, cy];
	}

	createBuilding(type, position, ...a){ //startPopulation
		//this.Buildings.push(new window["Village"](position, startPopulation));
		var building = createBuildingByName(type, position, ...a)
		this.Buildings.push(building);
		////var chunkedPosition = {x: position.x - position.x % this.chunkSizeWidth, y: position.y - position.y % this.chunkSizeHeight};
		//var positionInChunks = position//chunkSize
		//this.mapByChunks[chunkedPosition.x][chunkedPosition.y].push(building);
		return building;
	}

	drawChunkBorders(){
		push();
		fill("lightgreen");
		// var leftPoint = [-this.camera.position.x*this.camera.zoom + this.camera.offset.x, -this.camera.position.y*this.camera.zoom + this.camera.offset.y];
		var x1 = Math.max(-this.camera.position.x*this.camera.zoom + this.camera.offset.x, (-this.camera.position.x*this.camera.zoom + this.camera.offset.x)%(this.chunkSizeWidth*this.camera.zoom)); //leftPoint[0] % this.chunkSizeWidth
		// var y1 = -this.camera.position.y*this.camera.zoom + this.camera.offset.y; //leftPoint[1] % this.chunkSizeHeight
		var y1 = Math.max(-this.camera.position.y*this.camera.zoom + this.camera.offset.y, (-this.camera.position.y*this.camera.zoom + this.camera.offset.y)%(this.chunkSizeHeight*this.camera.zoom)); //leftPoint[0] % this.chunkSizeWidth


		var chunksToDrawAmountX = (Math.max(0, this.worldToScreenCoordX(0)) - Math.min(this.worldToScreenCoordX(this.chunkAmountWide*this.chunkSizeWidth), this.camera.offset.x*2 /*width*/))/this.camera.zoom;
		chunksToDrawAmountX = -(chunksToDrawAmountX - chunksToDrawAmountX%this.chunkSizeWidth)/this.chunkSizeWidth;
		// console.log(chunksToDrawAmountX)
		var chunksToDrawAmountY = (Math.max(0, this.worldToScreenCoordY(0)) - Math.min(this.worldToScreenCoordY(this.chunkAmountHigh*this.chunkSizeHeight), this.camera.offset.y*2 /*width*/))/this.camera.zoom;
		chunksToDrawAmountY = -(chunksToDrawAmountY - chunksToDrawAmountY%this.chunkSizeHeight)/this.chunkSizeHeight;
		
		// console.log(Math.min((width/this.camera.zoom - (width/this.camera.zoom)%this.chunkSizeWidth)/this.chunkSizeWidth, this.chunkAmountWide), x1)
		
		for (var i = 0; i < chunksToDrawAmountX + 2; i++) {
			line(x1 + i*this.chunkSizeWidth*this.camera.zoom, y1, x1+i*this.chunkSizeWidth*this.camera.zoom, y1 + this.chunkAmountHigh*this.chunkSizeHeight*this.camera.zoom);
		}
		
		for (var i = 0; i < chunksToDrawAmountY + 2; i++) {
			line(x1, y1 + i*this.chunkSizeHeight*this.camera.zoom, x1 + this.chunkAmountWide*this.chunkSizeWidth*this.camera.zoom, y1+i*this.chunkSizeHeight*this.camera.zoom); //x1+i*this.chunkSizeHeight - для интересного бага
		}
		pop();
	}

	drawImage(Image, position, scale, mode){
		push();
		switch (mode) {
			case "center":
				//scale(Image.width/gameWorld.standartImageWidth);
				//Image.resize(gameWorld.standartImageWidth, gameWorld.standartImageHeight);
				image(Image, position.x, position.y, Image.width*scale, Image.height*scale);
				break;
			case "top left":
				image(Image, position.x - Image.width/2*scale, position.y - Image.height/2*scale, Image.width*scale, Image.height*scale);
				break;
			default:
				image(Image, position.x, position.y, Image.width*scale, Image.height*scale);
				break;
		}
		pop();
	}

	worldToScreenCoords(pos){
		res = {x: 0, y: 0};
		
		res.x = (pos.x - this.camera.position.x)*this.camera.zoom + this.camera.offset.x;
		res.y = (pos.y - this.camera.position.y)*this.camera.zoom + this.camera.offset.y;

		return res;
	}

	screenToWorldCoords(pos){
		res = {x: 0, y: 0};

		res.x = (pos.x - this.camera.offset.x)/this.camera.zoom + this.camera.position.x;
		res.y = (pos.y - this.camera.offset.y)/this.camera.zoom + this.camera.position.y;

		return res;
	}

	worldToScreenCoordX(x){
		return (x - this.camera.position.x)*this.camera.zoom + this.camera.offset.x;
	}
	worldToScreenCoordY(y){
		return (y - this.camera.position.y)*this.camera.zoom + this.camera.offset.y;
	}

	screenToWorldCoordX(x){
		return (x - this.camera.offset.x)/this.camera.zoom + this.camera.position.x;
	}
	screenToWorldCoordY(y){
		return (y - this.camera.offset.y)/this.camera.zoom + this.camera.position.y;
	}

	getPosInChunks(pos){
		return {x: (pos.x-pos.x%this.chunkSizeWidth) / this.chunkSizeWidth, y: (pos.y - pos.y%this.chunkSizeHeight) / this.chunkSizeHeight};
	}

	getCoordInChunksX(x){
		// return (x-x%this.chunkSizeWidth) / this.chunkSizeWidth;
		return Math.trunc(x/this.chunkSizeWidth);
	}
	getCoordInChunksY(y){
		// return (y-y%this.chunkSizeHeight) / this.chunkSizeHeight;
		return Math.trunc(y/this.chunkSizeHeight);
	}
}