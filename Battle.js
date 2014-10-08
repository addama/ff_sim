function Battle(partySize) {
	// Wait a second for config.json to be loaded into config
	var app = this;
	setTimeout(function() {
		// Set the party size
		app.partySize = config.variables.partySize;
		if (partySize && partySize > 1) app.partySize = partySize;
		
		// Define the teams
		for (var i = 0; i < config.variables.teams; i++) {
			app.roster[config.variables.defaults.teamNames[i]] = [];
		}
		
		// Build the teams
		for (var i = 0; i < app.partySize; i++) {
			for (var team in app.roster) {
				var combatant = app.createCombatant(team, i.toString());
				app.roster[team].push(combatant);
			}
			
		}
		app.makeTurnOrder();
		console.log(app.turnOrder);
		app.currentCombatant = 0;
		console.log(app.whoseTurnIsIt());
	}, 100);
};

Battle.prototype = {
	constructor: Battle,
	
	roster: {},
	turnOrder: [],
	currentCombatant: 0,
	
	createCombatant: function(team, slot, type, element, race, gender) {
		if (!type) type = config.getRandomType();
		if (!element) element = config.getRandomElement();
		if (!race) race = config.getRandomRace();
		if (!gender) gender = config.getRandomGender();
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
		
		for (var team in this.roster) {
			for (var person in this.roster[team]) {
				this.turnOrder.push({slot: person, 'team': team, speed: this.roster[team][person].zipperStat('speed')});
			}
			this.turnOrder = sortBySpeed(this.turnOrder);
			this.turnOrder.reverse();
		}
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