function Effect(type, element, target, amount) {
	// type := 'damage', 'heal', 'dot', 'hot', 'buff', 'debuff'

	this.type = (this.validateType(type)) ? type : 'damage';
	this.element = (this.validateElement(element)) ? element : 'physical';
	this.target = (this.validateTarget(target)) ? target : 'target';
	this.amount = amount || 0;
	this.duration = 1;
	this.already = 0;
	
	this.title = (this.lists.titles[this.type][this.element]) ? this.lists.titles[this.type][this.element] : this.element + ' ' + this.type;
	
	if (this.type === 'buff' || this.type === 'debuff') {
		this.buffTarget = this.lists.buffTargets[this.element];
		this.duration = 3;
	}
	
	if (this.type === 'hot' || this.type === 'dot') {
		this.duration = 3;
	}
	
}

Effect.prototype = {
	constructor: Effect;
	
	lists: {
		types: 		[ 'damage', 'heal', 'hot', 'dot', 'buff', 'debuff' ],
		elements: 	[ 'life', 'death', 'holy', 'evil', 'fire', 'ice', 'earth', 'air', 'physical', 'psychic' ],
		targets: 	[ 'self', 'target', 'selfParty', 'targetParty' ],
		
		buffTargets: {
			air: 		'speed',
			earth: 		'vitality',
			holy: 		'strength',
			evil: 		'dexterity',
			life: 		'vitality',
			death: 		'wisdom',
			fire: 		'intellect',
			ice: 		'speed',
			physical: 	'strength',
			psychic: 	'intellect',
		},
		
		titles: {
			// Damage applies all of its damage in one hit
			damage: {
				air: 		'lightning strike',
				earth: 		'avalanche',
				holy: 		'divine retribution',
				evil: 		'horrifying realization',
				life: 		'heart stop',
				death: 		'sudden decay',
				fire: 		'scorch',
				ice: 		'freeze',
				physical: 	'slam',
				psychic: 	'aneurism',
			},
			// Heal applies all of its healing in one hit
			heal: {
				air: 		'energy surge',
				earth: 		'deep well',
				holy: 		'holy salve',
				evil: 		'lust for power',
				life: 		'lifegiving seed',
				death: 		'remake the body',
				fire: 		'fiery renewal',
				ice: 		'glacial mist',
				physical: 	'mend',
				psychic: 	'psychic restoration',
			},
			// HOT applies its healing in small amounts over several turns
			hot: {
				air: 		'misty coccoon',
				earth: 		'stone armor',
				holy: 		'favor',
				evil: 		'renewed vigor',
				life: 		'bloom',
				death: 		'life leech',
				fire: 		'cleansing flames',
				ice: 		'cool water',
				physical: 	'bandage',
				psychic: 	'vivid dreams',
			},
			// DOT applies its damage in small amounts over several turns
			dot: {
				air: 		'violent winds',
				earth: 		'rockslide',
				holy: 		'chastise',
				evil: 		'crippling fear',
				life: 		'strangle',
				death: 		'decay',
				fire: 		'on fire',
				ice: 		'frostbite',
				physical: 	'bleeding',
				psychic: 	'headache',
			},
			// Buff applies a passive bonus (Combatant.stats.mod) to a buffTargets stat 
			buff: {
				air: 		'burst of speed',
				earth: 		'stoneskin',
				holy: 		'divine strength',
				evil: 		'sinister purpose',
				life: 		'wild growth',
				death: 		'see the abyss',
				fire: 		'flare of intellect',
				ice: 		'ice floes',
				physical: 	'immense strength',
				psychic: 	'mental expansion',
			},
			// Debuff applies a passive detriment (Combatant.stats.mod) to a buffTargets stat
			debuff: {
				air: 		'buffeting winds',
				earth: 		'stone shrapnel',
				holy: 		'disfavor',
				evil: 		'unblinking gaze',
				life: 		'sapping vines',
				death: 		'see the abyss',
				fire: 		'panic',
				ice: 		'frozen',
				physical: 	'weakness',
				psychic: 	'brain drain',
			},
			
		}
	}
	
	validateType: function(type) {
		if (this.lists.types.indexOf(type)) {
			return true;
		}
		return false;
	}
	
	validateElement: function(element) {
		if (this.lists.elements.indexOf(element)) {
			return true;
		}
		return false;
	}
	
	validateTarget: function(target) {
		if (this.lists.targets.indexOf(target)) {
			return true;
		}
		return false;
	}
	
	getGranularAmount: function() {
		// Used to determine how much healing/damage is applied per turn for hots/dots, or per target for selfParty/targetParty 
		// Damage and Heal types have a duration of 1, so their damage per unit is higher
		return this.amount / this.duration;
	},
	
	
	
	
}