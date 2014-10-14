function Battle(partySize) {
	// Wait a second for config.json to be loaded into config
	var app = this;
	// Set the party size
	app.partySize = config.variables.partySize;
	if (partySize && partySize > 1) app.partySize = partySize;
	
	// Define the roster
	app.roster = {};
	for (var i = 0; i < config.variables.teams; i++) {
		var name = config.variables.defaults.teamNames[i]
		app.roster[name] = [];
	}
	
	// Build the teams
	for (var i = 0; i < app.partySize; i++) {
		for (var team in app.roster) {
			var combatant = app.createCombatant(team, i.toString());
			app.roster[team].push(combatant);
		}
		
	}
	app.makeTurnOrder();
	app.currentCombatant = 0;
	app.memory = {
		battles: 1,
		turns: 1,
	}
};

Battle.prototype = {
	constructor: Battle,
	roster: {},
	currentCombatant: 0,
	gameLoop: '',
	
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
		this.turnOrder = [];
		for (var side in this.roster) {
			for (var person in this.roster[side]) {
				this.turnOrder.push({'slot': person, 'team': side, 'speed': this.roster[side][person].zipperStat('speed')});
			}
		}
		
		this.turnOrder = sortBySpeed(this.turnOrder);
		this.turnOrder.reverse();
	},
	
	teamsAreAlive: function() {
		// Check each team to see if at least once of their combatants are alive
		// Returns false if any teams are completely dead
		for (var team in this.roster) {
			var teamDeaths = 0;
			for (var person in team) {
				if (person.isAlive === false) teamDeaths += 1;
			}
			if (teamDeaths === this.partySize) {
				log.out('Team ' + team + ' is completely wiped out.');
				return false;
			}
		}
		return true;
	},
	
	getCurrentActor: function() {
		if (this.currentCombatant === null) {
			this.currentCombatant = 0;
		}
		if (this.turnOrder) this.makeTurnOrder();
		var slot = this.turnOrder[this.currentCombatant].slot;
		var side = this.turnOrder[this.currentCombatant].team;
		return this.roster[side][slot];	
	},
	
	nextActor: function() {
		// Increments the Battle.currentCombatant pointer, skipping any dead Combatants
		if (this.currentCombatant >= this.turnOrder.length - 1) {
			this.currentCombatant = 0;
		} else {
			this.currentCombatant += 1;
		}
		var actor = this.getCurrentActor();
		if (actor.isAlive === false) {
			log.out('Actor not alive, skipping');
			while (this.currentCombatant.isAlive === false) {
				if (this.currentCombatant >= this.turnOrder.length - 1) {
					this.currentCombatant = 0;
				} else {
					this.currentCombatant += 1;
				}
			}
		}
	},
	
	generateState: function() {
		// Creates an object that contains health values for every combatant
		var state = [];
		for (var team in this.roster) {
			for (var person in this.roster[team]) {
				var him = this.roster[team][person];
				state.push({team: him.team, slot: him.slot, health: him.stats.health.now});
			}
		}
		return state;
	},
	
	applyEffect: function(effect, team, slot) {
		// Overwatch function that takes apart Effects and instructs Combatants in how to take them
		switch (effect.type) {
			case 'damage':
			case 'heal':
				this.roster[team][slot].alterHealth(effect.title, effect.baseDamage, effect.element, effect.type);
				break;
			case 'dot':
			case 'hot':
			case 'buff':
			case 'debuff':
				this.roster[team][slot].takeEffect(effect);
				break;
			default:
				break;
		}
	},
	
	startBattle: function() {
		console.group('BATTLE ' + this.memory.battles + ' BEGINS');
		
		this.gameLoop = setInterval(this.executeTurn(), 1000);
		
		this.memory.battles += 1;
		console.groupEnd();
		console.log('BATTLE END');
	},
	
	executeTurn: function() {
		if (this.teamsAreAlive()) {
			// Execute a single turn
			var state = this.generateState();
			var actor = this.getCurrentActor();
			var action = actor.chooseAbility(state);
			actor.tickEffects();
			if (actor.isAlive === false) {
				this.memory.turns += 1;
				this.nextActor();
				continue;
			}
			log.out(actor.displayName(false) + ' used ' + actor.abilities[action.ability].title + ' on ' + actor.abilities[action.ability].target);
			var effect = actor.abilities[action.ability].makeEffect();
			this.applyEffect(effect, action.target.team, action.target.slot);
			this.nextActor();
			this.memory.turns += 1;
			// Wait 1 second so it's not a blur of actions
			//setTimeout(function(){}, 1000);
		} else {
			clearInterval(this.gameLoop);
		}
	},

}