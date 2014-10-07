function Configuration() {}

Configuration.prototype = {
	constructor: Configuration,
	
	// Lists
	lists: {
		archetypes: [ 'tank', 'healer', 'rangedInt', 'rangedDex', 'meleeStr', 'meleeDex' ],
		elements: 	[ 'fire', 'ice', 'earth', 'air', 'holy', 'evil', 'life', 'death', 'physical', 'psychic' ],
		targets: 	[ 'self', 'target', 'targetParty', 'selfParty' ],
		genders: 	[ 'male', 'female' ],
		races: 		[ 'human', 'dwarf', 'elf', 'orc', 'troll', 'halfling', 'giant' ],
		effects: 	[ 'heal', 'damage', 'dot', 'hot', 'buff', 'debuff' ],
		stats: 		[ 'strength', 'dexterity', 'intellect', 'wisdom', 'vitality', 'speed' ],
		abilities: 	[ 
					'attack', 'fire', 'ice', 'earth', 'air', 'holy', 'evil', 'life', 'death', 'physical', 'psychic', 
					'human', 'dwarf', 'elf', 'halfling', 'troll', 'giant', 'orc',
					'tank', 'healer', 'rangedInt', 'rangedDex', 'meleeDex', 'meleeStr'
		],
	},
	
	titles: {
		races: {
			human: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			dwarf: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			elf: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			orc: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			troll: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			halfling: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
			giant: {
				fire: {},
				ice: {},
				earth: {},
				air: {},
				holy: {},
				evil: {},
				life: {},
				death: {},
				physical: {},
				psychic: {},
			},
		},
		
		abilities: {
			
			fire: {},
			ice: {},
			earth: {},
			air: {},
			holy: {},
			evil: {},
			life: {},
			death: {},
			physical: {},
			psychic: {},
		},
		
		effects: {
			fire: {},
			ice: {},
			earth: {},
			air: {},
			holy: {},
			evil: {},
			life: {},
			death: {},
			physical: {},
			psychic: {},
		}
	},
	
	variables: {
		partySize: 		3,
		dotDuration: 	3,
		hotDuration: 	3,
		teams:			2,
		defaults: {
			damage: 	10,
			element: 	'physical',
			archetype: 	'meleeStr',
			gender: 	'male',
			effect: 	'damage',
			target: 	'target',
			race:		'human',
			stat:		'vitality',
			teamNames:	[ 'left', 'right', 'top', 'bottom' ],
		}
		
	
	},
	
	// Randomization functions
	getRandomType: function() {
		var rand = Math.floor(Math.random() * this.lists.archetypes.length);
		return this.lists.archetypes[rand];
	},
	
	getRandomElement: function() {
		var rand = Math.floor(Math.random() * this.lists.elements.length);
		return this.lists.elements[rand];
	},
	
	getRandomGender: function() {
		var rand = Math.floor(Math.random() * this.lists.genders.length);
		return this.lists.genders[rand];
	},	
	
	getRandomRace: function() {
		var rand = Math.floor(Math.random() * this.lists.races.length);
		return this.lists.races[rand];
	},

	// Validation functions
	validateType: function(type) {			return (this.lists.archetypes.indexOf(type)) ? true : false		},
	validateElement: function(element) {	return (this.lists.elements.indexOf(element)) ? true : false	},
	validateTarget: function(target) {		return (this.lists.targets.indexOf(target)) ? true : false 		},
	validateGender: function(gender) {		return (this.lists.genders.indexOf(gender)) ? true : false		},
	validateRace: function(race) {			return (this.lists.races.indexOf(race)) ? true : false			},
	validateStat: function(stat) {			return (this.lists.stats.indexOf(stat)) ? true : false			},
	validateEffect: function(effect) {		return (this.lists.effects.indexOf(effect)) ? true : false		},
	
	// Utility functions
	abbreviateStat: function(stat) {
		// Return a 3 letter abbreviation of the given stat name
		if (stat === 'speed') stat = 'spd';
		var show = stat.substr(0,3);
		return show.toUpperCase();
	},
	titleCase: function(str) {
		return str.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
	},
	
	
	
}