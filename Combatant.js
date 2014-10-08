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
	
	// Assign titles
	this.titles = {};
	this.titles.race = config.titles.races[this.race][this.element] || this.race;
	this.titles.archetype = config.titles.archetypes[this.archetype][this.element] || this.archetype;
	
	// Assign stats
	this.stats = {};
	this.stats.race = config.stats.races[this.race];
	this.stats.archetype = config.stats.archetypes[this.archetype];
	this.stats.mod = {
		strength: 0, dexterity: 0, intellect: 0, wisdom: 0, vitality: 0, speed: 0
	};
	
	// Get basic abilities
	this.abilities = {};
	this.abilities.race = new Ability(this.race);
	this.abilities.archetype = new Ability(this.archetype);
	this.abilities.element = new Ability(this.element);
	
	// Assign abilities to behavior hooks
	this.behavior = {};
	this.assignBehaviorHooks();
	
	// Create a memory container
	this.memory = {};
	this.memory.hits = {};
	this.memory.hits.given = 0;
	this.memory.hits.taken = 0;
	
	console.groupCollapsed(this.displayName());
	console.log(this.displayMeta());
	console.log(this.displayStats());
	console.log(this.displayAbilities());
	console.log(this.chooseAbility());
	console.groupEnd();
};

Combatant.prototype = {
	constructor: Combatant,

	zipperStat: function(stat) {
		// Combine all of the stat layers and return the current effective amount for that stat 
		var result = this.stats.race[stat] + this.stats.archetype[stat] + this.stats.mod[stat];
		return result;
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
		function titleCase(str) {
			return str.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
		}

		var result = titleCase(this.gender) + ' ' + titleCase(this.titles.race) + ' ' + this.titles.archetype;
		return result;		
	},
	
	displayMeta: function() {
		var result = '[' + this.team.toUpperCase() + ':'+this.slot+'] '+this.element + ' ' + this.race + ' ' +this.archetype;
		return result;
	},
	
	assignBehaviorHooks: function() {
		/* 
			this.behavior.brave: ability to use when everything's fine
			this.behavior.danger: ability to use at low health
			this.behavior.concern: ability to use when others are in danger
			this.behavior.idle: ability to use when nothing important is happening


		*/
	
		
		

	},
	
	chooseAbility: function(state) {
		// Chooses an ability based on the state object given
		var rand = Math.floor(Math.random() * config.lists.abilityTypes.length);
		return this.abilities[config.lists.abilityTypes[rand]].title;
	},
	
	tickConditions: function() {
		
	},
}