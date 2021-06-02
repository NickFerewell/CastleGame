class Config{
	static professions = [ //Список профессий и их характеристики, которые могут появиться в строении
	{name: "army", health: 30, damage: 4, defence: 3}, //Здоровье медленно восстанавливается. Урон уменьшается, если здоровье маленькое. Защита уменьшает или поглощает урон, но может безвозвратно сломаться(починка только в городе(в специальном здании), дома.)
	{name: "worker", health: 20, damage: 1, defence: 0}, //d: 0,5
	{name: "farmer", health: 10, damage: 1, defence: 0} //аленькое здоровье, потому что фермеров должно быть много.
	];

	static imagePaths = {
		__default: "images/default.png",
		Village: "",
		Ruins: "images/Ruins.png",
		Castle: "",
	}
}