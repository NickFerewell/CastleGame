//import * from './buildings.js';
// import {Delaunay} from "d3-delaunay";

class World {
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
		this.chunkSizeWidth = 30;
		this.chunkSizeHeight = 30;
		this.chunkAmountWide = 100;
		this.chunkAmountHigh = 60;
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

		gameWorld.seed = prompt("Введи сид, ;Ю.\n" + "Текущий сид: " + gameWorld.seed, Math.floor(random()*100000));
		randomSeed(gameWorld.seed);
		noiseSeed(gameWorld.seed);

		console.log(this.chunkSizeWidth*this.chunkAmountWide)

		const cellAndPointsNum = 200; //300, 100, 200 - это количество точек(клеток) на всей карте. А концентрация этих точек это cellAndPointsNum / this.chunkSizeWidth*this.chunkAmountWide. Кол-во точек/количество пикселей. сколько точек в одном пикселе. Идеальная концентрация это 0.06(6) - 200/3000
		for(var i = 0; i < cellAndPointsNum; i++){
			points.push([random(this.chunkSizeWidth*this.chunkAmountWide), random(this.chunkSizeHeight*this.chunkAmountHigh)]);
		}
		// for (var i = 0; i < 2; i++) {
		// 	points = this.improveRandomPoints(points);
		// }
		this.makeRelaxed(points);
		const delaunay = d3.Delaunay.from(points);
		const voronoi = delaunay.voronoi([0, 0, this.chunkSizeWidth*this.chunkAmountWide, this.chunkSizeHeight*this.chunkAmountHigh]); //960, 500
		const cellPolygons = voronoi.cellPolygons();
		for (let cell of cellPolygons) {
			//cell.color = Utilities.getRandomCSSColor();
			var cellCentroid = this.findCentroidOfPolygonArrays(cell);
			var heightOfTheCell = noise(cellCentroid[0], cellCentroid[1])
			var cellColor = this.getColorOfHeightMapSmoothHex(heightOfTheCell); //noise()*2 - 1
  			this.MapOfRelief.push({bounds: cell, centroid: {x: cellCentroid[0], y: cellCentroid[1]}, height: heightOfTheCell, color: cellColor});
		}

		for(var x = 0; x < this.chunkAmountWide; x++){
			var yCollumn = []
			for(var y = 0; y < this.chunkAmountHigh; y++){
				yCollumn.push([]);
			}
			this.mapByChunks.push(yCollumn);
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
	        	const numChuncksToCheck = (inputManager.mouse.interactRadius - inputManager.mouse.interactRadius%gameWorld.chunkSizeWidth)/gameWorld.chunkSizeWidth + 1;
	        	var neighboursCells = Utilities.getNeighbours(this.mapByChunks, chx, chy, numChuncksToCheck);
	        	console.log(numChuncksToCheck**2);
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
	        	console.log(GUIManager.selectedObject, minDist, distances);
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
		push();
		translate(-gameWorld.camera.position.x + gameWorld.camera.offset.x, -gameWorld.camera.position.y + gameWorld.camera.offset.y);
		//scale(this.camera.zoom);
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
			console.log();
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
					this.createBuilding("Village", building, TestVillage.getRandomStartPopulation());
					break;
				case 2:
					//На этом месте на карте будет пустое место для сражений, полей, лесов, озёр, гор и т.д.
					break;
				case 3:
					this.createBuilding("Castle", building, TestVillage.getRandomStartPopulation());
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
		var leftPoint = [-gameWorld.camera.position.x + gameWorld.camera.offset.x, -gameWorld.camera.position.y + gameWorld.camera.offset.y];
		var x1 = leftPoint[0] % this.chunkSizeWidth;
		for (var i = 0; i < width - width%this.chunkSizeWidth; i++) {
			line(x1 + i*this.chunkSizeWidth, 0, x1+i*this.chunkSizeWidth, height);
		}
		var y1 = leftPoint[1] % this.chunkSizeHeight;
		for (var i = 0; i < height - height%this.chunkSizeHeight; i++) {
			line(0, y1 + i*this.chunkSizeHeight, width, y1+i*this.chunkSizeHeight); //x1+i*this.chunkSizeHeight - для интересного бага
		}
		pop();
	}

	drawImage(Image, position, mode){
		push();
		switch (mode) {
			case "center":
				//scale(Image.width/gameWorld.standartImageWidth);
				//Image.resize(gameWorld.standartImageWidth, gameWorld.standartImageHeight);
				image(Image, position.x, position.y);
				break;
			case "top left":
				image(Image, position.x - Image.width/2, position.y - Image.height/2);
				break;
			default:
				image(Image, position.x, position.y);
				break;
		}
		pop();
	}
}