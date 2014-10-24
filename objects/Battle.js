function Battle(partySize) {
	// Wait a second for config.json to be loaded into config
	var app = this;
	// Set the party size
	app.partySize = config.variables.partySize;
	if (partySize && partySize > 1) app.partySize = partySize;
	
	app.turnLength = config.variables.turnLength;
	
	// Define the roster
	app.roster = {};
	for (var i = 0; i < config.variables.teams; i++) {
		var name = config.variables.defaults.teamNames[i]
		app.roster[name] = [];
	}
	
	// Build the teams and give each Combatant a channel
	for (var i = 0; i < app.partySize; i++) {
		for (var team in app.roster) {
			var combatant = app.createCombatant(team, i.toString());
			log.register(combatant.channel, combatant.channel, team);			
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
	inProgress: false,
	
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
				if (this.roster[side][person].isAlive === true) {
					this.turnOrder.push({'slot': person, 'team': side, 'speed': this.roster[side][person].zipperStat('speed')});
				}
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
			for (var person in this.roster[team]) {
				if (this.roster[team][person].isAlive === false) teamDeaths += 1;
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
		if (!this.turnOrder) this.makeTurnOrder();
		log.out(this.currentCombatant, 'console');
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
			//log.out('Actor not alive, skipping');
			while (this.currentCombatant.isAlive === false) {
				if (this.currentCombatant >= this.turnOrder.length - 1) {
					this.currentCombatant = 0;
				} else {
					this.currentCombatant += 1;
				}
			}
		}
	},
	
	generateState: function(perspective) {
		// Creates an object that contains health values for every combatant
		var state = {'good':[], 'bad':[]};
		for (var team in this.roster) {
			for (var person in this.roster[team]) {
				var him = this.roster[team][person];
				var bias = (team === perspective) ? 'good' : 'bad';
				if (him.isAlive) state[bias].push({team: him.team, slot: him.slot, health: him.stats.health.now});
			}
		}
		return state;
	},
	
	applyEffect: function(effect, team, slot) {
		// Overwatch function that takes apart Effects and instructs Combatants in how to take them
		var victim = this.roster[team][slot];
		switch (effect.type) {
			case 'damage':
			case 'heal':
				victim.alterHealth(effect.title, effect.baseDamage, effect.element, effect.type);
				break;
			case 'dot':
			case 'hot':
			case 'buff':
			case 'debuff':
				victim.takeEffect(effect);
				break;
			default:
				break;
		}
	},
	
	startBattle: function() {
		//console.group('BATTLE ' + this.memory.battles + ' BEGINS');
		var app = this;
		app.inProgress = true;
		log.out('BATTLE ' + this.memory.battles + ' START');
		app.gameLoop = setInterval(function() {
			if (app.teamsAreAlive()) {
				// Execute a single turn
				app.makeTurnOrder();
				var actor = app.getCurrentActor();
				actor.tickEffects();

				if (actor.isAlive === false) {
					log.out(actor.displayName(false) + ' is dead...', actor.channe);
				} else {
					var state = app.generateState(actor.team);
					var action = actor.chooseAbility(state);
				
					var effect = actor.abilities[action.ability].makeEffect();
					if (effect.target === 'selfParty') {
						// Apply effect to the actor's team
						log.out(actor.displayName(true) + ' used ' + actor.abilities[action.ability].title + ' on their party', actor.channel);
						for (var victim in app.turnOrder) {
							if (app.turnOrder[victim].team === actor.team) app.applyEffect(effect, action.target.team, app.turnOrder[victim].slot);
						}
					} else if (effect.target === 'targetParty') {
						// Apply effect to the enemy team
						log.out(actor.displayName(true) + ' used ' + actor.abilities[action.ability].title + ' on ' + app.roster[action.target.team][action.target.slot].displayName(false) + '\'s party', actor.channel);
						for (var victim in app.turnOrder) {
							if (app.turnOrder[victim].team === action.target.team) app.applyEffect(effect, action.target.team, app.turnOrder[victim].slot);
						}
					} else {
						// Apply effect to the chosen actor
						log.out(actor.displayName(true) + ' used ' + actor.abilities[action.ability].title + ' on ' + app.roster[action.target.team][action.target.slot].displayName(false), actor.channel);
						app.applyEffect(effect, action.target.team, action.target.slot);
					}
				}
				app.nextActor();
				app.memory.turns += 1;
			} else {
				log.out('BATTLE ' + app.memory.battles + ' END AFTER ' + app.memory.turns + ' turns');
				clearInterval(app.gameLoop);
			}
		}, app.turnLength);
		app.inProgress = false;
		app.memory.battles += 1;
		//console.groupEnd();
	},

}