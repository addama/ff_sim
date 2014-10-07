function Ability(type) {
	//console.log('[ABILITY] ' + type);
	this.type = (this.validateType(type)) ? type : 'attack'
	this.title = this.lists.abilities[type].title;
	this.element = this.lists.abilities[type].element;
	this.baseDamage = this.lists.abilities[type].baseDamage;
	this.effect = this.lists.abilities[type].effect;
	this.target = this.lists.abilities[type].target;
	this.isGood = this.lists.abilities[type].isGood;
	//console.log(this.displayName());
};

Ability.prototype = {
	constructor: Ability,
	
	lists: {
		types: [ 
			'attack', 'fire', 'ice', 'earth', 'air', 'holy', 'evil', 'life', 'death', 'physical', 'psychic', 
			'human', 'dwarf', 'elf', 'halfling', 'troll', 'giant', 'orc',
			'tank', 'healer', 'rangedInt', 'rangedDex', 'meleeDex', 'meleeStr'
		],
		abilities: {
			// Generic Attack ability
			attack: {
				title: 'attack',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
		
			// Element-specific abilities
			fire: {
				title: 'scorch',
				element: 'fire',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			ice: {
				title: 'freeze',
				element: 'ice',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			earth: {
				title: 'rockslide',
				element: 'earth',
				baseDamage: 1,
				effect: 'dot',
				effectTarget: 'targetParty',
				isGood: false,
			},
			air: {
				title: 'lightning strike',
				element: 'air',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			holy: {
				title: 'bless',
				element: 'holy',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'selfParty',
				isGood: true,
			},
			evil: {
				title: 'curse',
				element: 'evil',
				baseDamage: 1,
				effect: 'debuff',
				effectTarget: 'targetParty',
				isGood: false,
			},
			life: {
				title: 'bloom',
				element: 'life',
				baseDamage: 1,
				effect: 'hot',
				effectTarget: 'target',
				isGood: true,
			},
			death: {
				title: 'decay',
				element: 'death',
				baseDamage: 1,
				effect: 'dot',
				effectTarget: 'target',
				isGood: false,
			},
			physical: {
				title: 'charge',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			psychic: {
				title: 'overload synapses',
				element: 'psychic',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			
			// Race-specific abilities
			human: {
				title: 'human spirit',
				element: 'physical',
				baseDamage: 1,
				effect: 'hot',
				effectTarget: 'self',
				isGood: true,
			},
			dwarf: {
				title: 'stoneskin',
				element: 'physical',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'self',
				isGood: true,
			},
			elf: {
				title: 'fade',
				element: 'physical',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'self',
				isGood: true,
			},
			halfling: {
				title: 'burst of energy',
				element: 'physical',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'self',
				isGood: true,
			},
			troll: {
				title: 'troll blood',
				element: 'physical',
				baseDamage: 1,
				effect: 'hot',
				effectTarget: 'self',
				isGood: true,
			},
			orc: {
				title: 'enrage',
				element: 'physical',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'self',
				isGood: true,
			},
			giant: {
				title: 'sweep',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'targetParty',
				isGood: false,
			},
			
			// Type-specific abilities
			tank: {
				title: 'guard',
				element: 'physical',
				baseDamage: 1,
				effect: 'buff',
				effectTarget: 'self',
				isGood: true,
			},
			healer: {
				title: 'triage',
				element: 'life',
				baseDamage: 1,
				effect: 'heal',
				effectTarget: 'selfParty',
				isGood: true,
			},
			meleeDex: {
				title: 'takedown',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			meleeStr: {
				title: 'cleave',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'targetParty',
				isGood: false,
			},
			rangedInt: {
				title: 'nuke',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
			rangedDex: {
				title: 'snipe',
				element: 'physical',
				baseDamage: 1,
				effect: 'damage',
				effectTarget: 'target',
				isGood: false,
			},
		},
	},
	
	validateType: function(type) {
		if (this.lists.types.indexOf(type)) {
			return true;
		}
		return false;
	},
	
	displayName: function(verbose) {
		function titleCase(str) {
			return str.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
		}
		var result = titleCase(this.title) + ' (' + this.element + ' ' + this.effect + ')';
		return result;
	},
	
	makeEffect: function() {
		var effect = new Effect(this.effect, this.element, this.effectTarget, this.baseDamage);
		return effect;
	},
}