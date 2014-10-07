function Battle(partySize) {
	// http://en.wikipedia.org/wiki/Box-drawing_character
	if (partySize && partySize > 0) {
		this.partySize = partySize;
	}
	for (var i = 0; i < this.partySize; i++) {
		var combatantLeft = this.createCombatant('left', i.toString());
		var combatantRight = this.createCombatant('right', i.toString());
		this.roster.left.push(combatantLeft);
		this.roster.right.push(combatantRight);
	}
	this.turnOrder = [];
	this.makeTurnOrder();
	console.log(this.turnOrder);
	this.currentCombatant = 0;
	console.log(this.whoseTurnIsIt());
};

Battle.prototype = {
	constructor: Battle,
	partySize: 6,
	
	roster: {
		left: [],
		right: [],
	},
	
	lists: {
		type: [ 'tank', 'healer', 'meleeDex', 'meleeStr', 'rangedInt', 'rangedDex' ],
		element: [ 'life', 'death', 'holy', 'evil', 'fire', 'ice', 'earth', 'air', 'physical', 'psychic' ],
		gender: [ 'male', 'female' ],
		race: [ 'human', 'dwarf', 'elf', 'orc', 'troll', 'halfling', 'giant' ],
	},
	
	getRandomType: function() {
		var rand = Math.floor(Math.random() * this.lists.type.length);
		return this.lists.type[rand];
	},
	
	getRandomElement: function() {
		var rand = Math.floor(Math.random() * this.lists.element.length);
		return this.lists.element[rand];
	},
	
	getRandomGender: function() {
		var rand = Math.floor(Math.random() * this.lists.gender.length);
		return this.lists.gender[rand];
	},	
	
	getRandomRace: function() {
		var rand = Math.floor(Math.random() * this.lists.race.length);
		return this.lists.race[rand];
	},
	
	createCombatant: function(team, slot, type, element, race, gender) {
		if (!type) type = this.getRandomType();
		if (!element) element = this.getRandomElement();
		if (!race) race = this.getRandomRace();
		if (!gender) gender = this.getRandomGender();
		if (!team) return false;
		if (!slot) return false;
		
		var combatant = new Combatant(team, slot, type, element, race, gender);
		return combatant;
	},
	
	makeTurnOrder: function() {
		function sortBySpeed(array) {
			return array.sort(function(a, b) {
				var x = a.speed; var y = b.speed;
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}	
	
		for (var person in this.roster.left) {
			this.turnOrder.push({slot: person, team: 'left', speed: this.roster.left[person].zipperStat('speed')});
		}
		
		for (var person in this.roster.right) {
			this.turnOrder.push({slot: person, team: 'right', speed: this.roster.right[person].zipperStat('speed')});
		}
		this.turnOrder = sortBySpeed(this.turnOrder);
		this.turnOrder.reverse();
	},
	
	whoseTurnIsIt: function() {
		if (!this.currentCombatant) {
			this.currentCombatant = 0;
		}
		
		return this.roster[this.turnOrder[this.currentCombatant].team][this.turnOrder[this.currentCombatant].slot];
	},
	
	executeTurn: function() {
		var actor = this.whoseTurnIsIt();
		var action = actor.chooseAbility();
		
	},
}