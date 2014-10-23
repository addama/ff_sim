function Combatant(team, slot, archetype, element, race, gender) {
	//console.log('[COMBATANT] ' + archetype);
	this.conditions = [];
	this.archetype = archetype;
	this.element = element;
	this.race = race;
	this.gender = gender;
	this.team = team;
	this.slot = slot;
	this.isAlive = true;
	
	// Fix any errors
	if (this.race === 'dwarf' || this.race === 'giant') {
		// There are no female dwarves or giants
		this.gender = 'male';
	}
	
	if (this.race === 'halfling' && (this.archetype === 'tank'|| this.archetype === 'meleeStr')) {
		// Halflings are too timid to be tanks, and not strong enough to be meleeStr
		this.archetype = 'meleeDex';
	}
	
	if (this.race === 'giant' && (this.archetype === 'rangedInt' || this.archetype === 'healer')) {
		// Giants are too dumb to be magic users
		this.archetype = 'meleeStr';
	}
	
	if ((this.race === 'orc' || this.race === 'giant') && this.element === 'psychic') {
		// Orcs and Giants do not possess the mental faculty to be Psychic types
		this.element = 'physical';
	}
	
	if (this.race === 'merfolk' && (this.element !== 'ice' && this.element !== 'psychic')) {
		// Merfolk are only ice/psychic element
		this.element = 'ice';
	}
	
	if (this.race === 'demon' && (this.element !== 'fire' && this.element !== 'evil' && this.element !== 'death' && this.element !== 'physical')) {
		// Demons are only fire/evil/death/physical element
		this.element = 'fire';
	}
	
	// Assign titles
	this.titles = {};
	this.titles.race = config.titles.races[this.race][this.element] || this.race;
	this.titles.archetype = config.titles.archetypes[this.archetype][this.element] || this.archetype;
	// Small title correction for female physical demons
	if (this.race === 'demon' && this.element === 'physical' && this.gender === 'female') {
		this.titles.race = 'succubus';
	}
	
	// Assign stats
	this.stats = {};
	this.stats.race = config.stats.races[this.race];
	this.stats.archetype = config.stats.archetypes[this.archetype];
	this.stats.mod = {
		strength: 0, dexterity: 0, intellect: 0, wisdom: 0, vitality: 0, speed: 0
	}
	this.stats.health = {
		now: this.zipperStat('vitality') * 5,
		max: this.zipperStat('vitality') * 5
	}
	
	// Get basic abilities
	this.abilities = [];
	this.abilities.push(new Ability(this.race));
	this.abilities.push(new Ability(this.archetype));
	this.abilities.push(new Ability(this.element));
	
	// Make the container for Effects
	this.effects = {};
	
	// Assign abilities to behavior hooks
	this.behavior = {};
	
	// Generate the channel key this Combatant will use
	this.channel = config.generateChannelName();

	// Create a memory container
	this.memory = {};
	this.memory.hits = {};
	this.memory.hits.given = 0;
	this.memory.hits.taken = 0;
	
	console.groupCollapsed(this.displayName());
	console.log(this.displayMeta());
	console.log(this.displayStats());
	console.log(this.displayAbilities());
	console.groupEnd();
};

Combatant.prototype = {
	constructor: Combatant,

	genderSymbols: {
		'male': '&#9794;',
		'female': '&#9792;'
	},
	
	zipperStat: function(stat) {
		// Combine all of the stat layers and return the current effective amount for that stat 
		var result = this.stats.race[stat] + this.stats.archetype[stat] + this.stats.mod[stat];
		return result;
	},
	
	getHealthPercentage: function() {
		return Math.floor((this.stats.health.now / this.stats.health.max) * 100) + '%';
	},
	
	displayStats: function() {
		var result = '';
		for (var stat in config.lists.stats) {
			stat = config.lists.stats[stat].toLowerCase();
			var show = config.abbreviateStat(stat);
			result += '[' + show + '] ' + this.zipperStat(stat) + '\t(' + this.stats.race[stat] + ',' + this.stats.archetype[stat] + ',' + this.stats.mod[stat] + ')\n';
		}
		return result;
	},
	
	displayAbilities: function() {
		var result = 'Abilities:\n';
		for (var ability in this.abilities) {
			ability = this.abilities[ability];
			result += '\t- ' + ability.displayName() + '\n';
			result += '\t  ' + ability.displayStats() + '\n\n';
		}
		return result;
	},
	
	displayName: function(verbose) {
		var result = '' + this.genderSymbols[this.gender] + ' ' + config.titleCase(this.titles.race) + ' ' + this.titles.archetype;
		if (verbose) result += ' [' + this.getHealthPercentage() + ']';
		return result;		
	},
	
	displayMeta: function() {
		var result = '[' + this.team.toUpperCase() + ':'+this.slot+'] '+this.element + ' ' + this.race + ' ' +this.archetype;
		return result;
	},
	
	displayTeam: function() {
		var result = '[' + this.team + ':' + this.slot + '] ';
		return result;
	},
	
	alterHealth: function(name, amount, element, type) {
		// Applies damage/healing, and returns true if the damage killed it
		if (type === 'heal' || type === 'hot') {
			this.stats.health.now += amount;
			if (this.stats.health.now > this.stats.health.max) this.stats.health.now = this.stats.health.max;
			log.out(this.displayName(true) + ' +' + amount + ' (' + name + ')', this.channel);
			return false;
		} else if (type === 'damage' || type === 'dot') {
			if (amount >= this.stats.health.now) {
				this.stats.health.now = 0;
				this.isAlive = false;
				var remaining = amount - this.stats.health.now;
				log.out(this.displayName(true) + ' -' + amount + ' (' + element + ') ' + name + ' --> DEAD (' + remaining + ' overkill).', this.channel);
				return true;
			} else {
				this.stats.health.now -= amount;
				log.out(this.displayName(true) + ' -' + amount + ' (' + element + ') ' + name, this.channel);
				return false;
			}
		}
	},
	
	takeEffect: function(effect) {
		// Adds the Effect to the Combatant.effects
		if (this.effects[effect.type]) {
			//log.out(this.displayName(true) + ' refreshed their ' + config.titleCase(this.effects[effect.type].title) + ' effect', this.channel);
			this.effects[effect.type] = effect;
		} else {
			this.effects[effect.type] = effect;
			log.out(this.displayName(true) + ' gained ' + config.titleCase(this.effects[effect.type].title), this.channel);
		}
	},
	
	chooseAbility: function(state) {
		// Chooses an ability index based on the state object given
		// There is currently no AI here, just random numbers. Behavior will be added later
		var rand = Math.floor(Math.random() * this.abilities.length);
		var choice = this.abilities[rand];
		switch (choice.target) {
			case 'self':
			case 'selfParty':
				return {'target': {'team': this.team, 'slot': this.slot}, 'ability': rand};
				break;
				
			case 'target':
			case 'targetParty':
			default:
				var enemy = state['bad'][Math.floor(Math.random() * state['bad'].length)];
				return {'target': {'team': enemy.team, 'slot': enemy.slot}, 'ability': rand};
				break;
		}		
	},
	
	tickEffects: function() {
		if (this.isAlive) {
			for (var effect in this.effects) {
				if (this.effects[effect].type === 'dot' || this.effects[effect].type === 'hot') {
					this.alterHealth(this.effects[effect].title, this.effects[effect].baseDamage, this.effects[effect].element, this.effects[effect].type);
				}
				this.effects[effect].tick();
				
				if (!this.effects[effect].isAlive) {
					log.out(this.displayName(false) + ' lost ' + this.effects[effect].title, this.channel);
					this.effects[effect] = null;
				}
			}
		}
	},
}












