class Building{
	constructor(position, type){
		this.position = position;
		this.type = type;
		//gameWorld.Buildings.push(this);
	}

	draw(){

	}

	update(){
		this.posOnScreen = Utilities.Add(Utilities.Mult(Utilities.Sub(this.position, gameWorld.camera.position), gameWorld.camera.zoom), gameWorld.camera.offset);
	}
}

class TestVillage extends Building{
	constructor(position, startPopulation){
		super(position, "Village");
		this.position = position;
		this.population = startPopulation;
		this.maxPopulation = 8;
		//gameWorld.Buildings.push(this);
	}

	draw(){
		circle(this.posOnScreen.x, this.posOnScreen.y, this.population.length);
	}

	update(){
		this.growPopulation();
		super.update();
	}

	growPopulation(){
		if(this.population.length < 8){
			this.population.push(Utilities.randFromArray(Config.professions));
		}
	}

	static getRandomStartPopulation(){
		var result = [];
		for(var i = 0; i < 3; i++){
			result.push(Utilities.randFromArray(Config.professions));
		}
		return result;
	}
}
	
class TestCastle extends Building{
	constructor(position, startPopulation){
		super(position, "Castle");
		this.position = position;
		this.population = startPopulation;
		this.initialRadius = 7;
		this.updateRadius();
		this.growProgress = 0;
		this.growSpeed = 1/2.3; //0.75, 1 Время роста на одного жителя в секундах
		this.growUnit = 1; //unitsPerGrowth
		this.maxSize = 18/2;
	}

	update(){
		super.update();

		//growing
		if(this.population.length < this.maxSize){
			this.growProgress += this.growSpeed/FPS;
			if(this.growProgress >= 1){ //неправильно - переделать! А если скорость(время роста) равно 60, а!
				//console.log(this.growProgress);
				for (var i = 0; i < this.growUnit; i++) {
					this.growPopulation();
				}
				this.updateRadius()
				this.growProgress = 0;
			}
		} else{
			/*
			Начать чуму с каким-то шансом,
			Начать копить на новый замок,
			Начать восстание, если недовольство жителей большое,
			Сообщить о том, что этот замок достиг максимума, и , что его надо развивать
			*/
		}
	}

	draw(){
	    push();
	    fill("red");
	    stroke(31);
	    strokeWeight(2);
	    translate(this.posOnScreen.x, this.posOnScreen.y);
	    beginShape();
	    for(let i = 0; i < 5; i++){
	        let angle = map(i, 0, 5, 0, TWO_PI) - HALF_PI; //если сделать + половина Пи, то будет по другому, эстетичнее
	        let x = this.radius * cos(angle);
	        let y = this.radius * sin(angle);
	        vertex(x, y);
	    }
	    endShape(CLOSE);
	    pop();
	    // console.log(this.position.x, this.position.y)
	}

	sendArmyTo(targetCastle){
		new Army()
	}

	updateRadius(){
		this.radius = (this.initialRadius + ((this.population.length-1) * 2));
	}

	growPopulation(probabilities){ //weiths
		this.population.push(Utilities.randFromArray(Config.professions));
	}
}

class TestRuins extends Building{
	constructor(position){
		super();
		this.variant = 1 || 0; //Сделать рандомным, надо где-то 4 варианта разрушенных замков, портов, ферм, домиков. Отдельной постройкой сделать сожжённые леса. Они не восстанавливаются, их можно только расчистить.
		this.position = position;

		// this.position = {x: 100, y: 100};
	}

	draw(){
		push();
		rectMode(CENTER);
		rect(this.posOnScreen.x, this.posOnScreen.y, 20, 20);
		pop();
	}
}

class Ruins extends Building{
	constructor(position){
		this.position = position;
		this.colorPalette = "#994b02";
	}

	draw(){
		image(images.Ruins, this.posOnScreen.x, this.posOnScreen.y);
	}
}

/*let buildings = {
	Village,
	Building
} */

/*
class buildingFactory{
	constructor(){
		this.specBuildings = {
			__default: 'Building',
            __building: 'Building',
            __village: 'Village',
        }
    };
    static specBuildings = {
			__default: 'Building',
            __building: 'Building',
            __village: 'Village',
    }

	static buildings = {
		Village,
	};

	static create(name, ...args){
		let className = this.specBuildings[name] ? this.specBuildings[name] : this.specBuildings['__default'];
        return new this.buildings[className](name);
	}
}
*/

/*
const buildingFactory = {
    specBuildings: {
		__default: 'Building',
        __building: 'Building',
        __village: 'Village',
    },
    create(name, ...args) {
        let cls = this.specBuildings[name] || this.specBuildings.__default;
        console.log(cls);
        return new cls(...args);
    }
};
*/

/* //eval - функция, убивающая весь смысл! Невероятно мощная, могучая, но опасная
function createBuildingByNameEval(name,...a) { //createBuilding, uildingFactory
    var b = eval(name);
    return new b(...a);
}
*/

function createBuildingByName(name,...a) { //createBuilding, buildingFactory //Дополнительные аргументы для каждого типа постройки разные соответственно её типу, поэтому, например, у руин не надо указывать начальную популяцию - её там нет.
	this.buildings = {
		__default: Building,
		Village,
		Castle,
		Ruins,
		TestVillage,
		TestCastle,
		TestRuins,
	};
    var b = this.buildings[name] || this.buildings.__default;
    return new b(...a);
}
//export {buildingFactory, Village, Building};
