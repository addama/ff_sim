function Combatant(team, slot, type, element, race, gender) {
	//console.log('[COMBATANT] ' + type);
	this.conditions = [];
	this.type = type;
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
	
	if (this.race === 'halfling' && (this.type === 'tank'|| this.type === 'meleeStr')) {
		// Halflings are too timid to be tanks, and not strong enough to be meleeStr
		this.type = 'meleeDex';
	}
	
	if (this.race === 'giant' && (this.type === 'rangedInt' || this.type === 'healer')) {
		// Giants are too dumb to be magic users
		this.type = 'meleeStr';
	}
	
	if ((this.race === 'orc' || this.race === 'giant') && this.element === 'psychic') {
		// Orcs and Giants do not possess the mental faculty to be Psychic types
		this.element = 'physical';
	}
	
	// Assign titles
	this.titles = {};
	this.titles.race = this.lists.races[this.race].titles[this.element] || this.race;
	this.titles.type = this.lists.types[this.type].titles[this.element] || this.type;
	
	// Assign stats
	this.stats = {};
	this.stats.race = this.lists.races[this.race].stats;
	this.stats.type = this.lists.types[this.type].stats;
	this.stats.mod = {
		strength: 0, dexterity: 0, intellect: 0, wisdom: 0, vitality: 0, speed: 0
	};
	
	// Get basic abilities
	this.abilities = {};
	this.abilities.race = new Ability(this.race);
	this.abilities.type = new Ability(this.type);
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

	lists: {
		stats: [ 'strength', 'dexterity', 'intellect', 'wisdom', 'vitality', 'speed' ],
		abilityTypes: [ 'type', 'race', 'element' ],
		races: {
			human: {
				titles: {
					air: 		'',
					earth: 		'',
					holy: 		'',
					evil: 		'',
					life: 		'',
					death: 		'',
					fire: 		'',
					ice: 		'',
					physical: 	'',
					psychic: 	'mutant',
				},
				stats: {
					strength: 	2,
					dexterity: 	2,
					intellect: 	2,
					wisdom: 	1,
					vitality: 	2,
					speed: 		2,
				},
			},
			dwarf: {
				titles: {
					air: 		'',
					earth: 		'earthen',
					holy: 		'',
					evil: 		'',
					life: 		'',
					death: 		'',
					fire: 		'',
					ice: 		'',
					physical: 	'',
					psychic: 	'',
				},
				stats: {
					strength: 	2,
					dexterity: 	1,
					intellect: 	1,
					wisdom: 	2,
					vitality: 	3,
					speed: 		1,
				},			
			},
			elf: {
				titles: {
					air: 		'',
					earth: 		'',
					holy: 		'high elf',
					evil: 		'dark elf',
					life: 		'wood elf',
					death: 		'drow',
					fire: 		'',
					ice: 		'',
					physical: 	'',
					psychic: 	'',
				},
				stats: {
					strength: 	1,
					dexterity: 	3,
					intellect: 	2,
					wisdom: 	3,
					vitality: 	1,
					speed: 		3,
				},
			},
			orc: {
				titles: {
					air: 		'',
					earth: 		'',
					holy: 		'',
					evil: 		'',
					life: 		'',
					death: 		'',
					fire: 		'',
					ice: 		'',
					physical: 	'',
					psychic: 	'',
				},
				stats: {
					strength: 	3,
					dexterity: 	1,
					intellect: 	1,
					wisdom: 	2,
					vitality: 	2,
					speed: 		1,
				},			
			},
			troll: {
				titles: {
					air: 		'',
					earth: 		'sand troll',
					holy: 		'',
					evil: 		'',
					life: 		'forest troll',
					death: 		'',
					fire: 		'',
					ice: 		'ice troll',
					physical: 	'',
					psychic: 	'',
				},
				stats: {
					strength: 	1,
					dexterity: 	1,
					intellect: 	1,
					wisdom: 	1,
					vitality: 	1,
					speed: 		1,
				},			
			},
			halfling: {
				titles: {
					air: 		'',
					earth: 		'',
					holy: 		'',
					evil: 		'pygmy',
					life: 		'',
					death: 		'',
					fire: 		'',
					ice: 		'',
					physical: 	'',
					psychic: 	'',
				},
				stats: {
					strength: 	1,
					dexterity: 	3,
					intellect: 	3,
					wisdom: 	1,
					vitality: 	1,
					speed: 		3,
				},			
			},
			giant: {
				titles: {
					air: 		'',
					earth: 		'construct',
					holy: 		'',
					evil: 		'',
					life: 		'homunculous',
					death: 		'',
					fire: 		'fire giant',
					ice: 		'ice giant',
					physical: 	'golem',
					psychic: 	'',
				},
				stats: {
					strength: 	3,
					dexterity: 	1,
					intellect: 	0,
					wisdom: 	0,
					vitality: 	3,
					speed: 		1,
				},			
			},
		},
		types: {
			tank: {
				titles: {
					air: 		'Stormtrooper',
					earth: 		'Seigebreaker',
					holy: 		'Paladin',
					evil: 		'Doomlord',
					life: 		'Life Warden',
					death: 		'Death Knight',
					fire: 		'Salamander',
					ice: 		'Vanguard',
					physical: 	'Warrior',
					psychic: 	'Mageknight',
				},
				stats: {
					strength: 	2,
					dexterity: 	2,
					intellect: 	0,
					wisdom: 	0,
					vitality: 	3,
					speed: 		1,
				},
			},
			healer: {
				titles: {
					air: 		'Stormsinger',
					earth: 		'Druid',
					holy: 		'Cleric',
					evil: 		'Fleshbinder',
					life: 		'Druid',
					death: 		'Lich',
					fire: 		'Taskmaster',
					ice: 		'Skald',
					physical: 	'Battle Priest',
					psychic: 	'Eidolon',
				},
				stats: {
					strength: 	0,
					dexterity: 	0,
					intellect: 	2,
					wisdom: 	3,
					vitality: 	1,
					speed: 		0,
				},
			},
			meleeDex: {
				titles: {
					air: 		'Dervish',
					earth: 		'Ranger',
					holy: 		'Monk',
					evil: 		'Rogue',
					life: 		'Swordsage',
					death: 		'Assassin',
					fire: 		'Pirate',
					ice: 		'Frostwalker',
					physical: 	'Berserker',
					psychic: 	'Mindblade',
				},
				stats: {
					strength: 	2,
					dexterity: 	3,
					intellect: 	0,
					wisdom: 	0,
					vitality: 	1,
					speed: 		2,
				},
			},
			meleeStr: {
				titles: {
					air: 		'Wanderer',
					earth: 		'Mountaineer',
					holy: 		'Crusader',
					evil: 		'Dreadnought',
					life: 		'Avenger',
					death: 		'Executioner',
					fire: 		'Dragon Knight',
					ice: 		'Rune Carver',
					physical: 	'Berzerker',
					psychic: 	'Harrier',
				},
				stats: {
					strength: 	3,
					dexterity: 	2,
					intellect: 	0,
					wisdom: 	0,
					vitality: 	2,
					speed: 		1,
				},
			},
			rangedDex: {
				titles: {
					air: 		'Outrider',
					earth: 		'Ranger',
					holy: 		'Herald',
					evil: 		'Stalker',
					life: 		'Hivemaster',
					death: 		'Dirgesinger',
					fire: 		'Sapper',
					ice: 		'Spellbreaker',
					physical: 	'Archer',
					psychic: 	'Bard',
				},
				stats: {
					strength: 	0,
					dexterity: 	3,
					intellect: 	2,
					wisdom: 	0,
					vitality: 	0,
					speed: 		3,
				},
			},
			rangedInt: {
				titles: {
					air: 		'Aeromancer',
					earth: 		'Shaman',
					holy: 		'Priest',
					evil: 		'Warlock',
					life: 		'Bloodmage',
					death: 		'Necromancer',
					fire: 		'Pyromancer',
					ice: 		'Frostmage',
					physical: 	'Librarian',
					psychic: 	'Mindwarp',
				},
				stats: {
					strength: 	0,
					dexterity: 	0,
					intellect: 	3,
					wisdom: 	2,
					vitality: 	0,
					speed: 		0,
				},
			},
		},
	},
	
	zipperStat: function(stat) {
		// Combine all of the stat layers and return the current effective amount for that stat 
		var result = this.stats.race[stat] + this.stats.type[stat] + this.stats.mod[stat];
		return result;
	},
	
	abbreviateStat: function(stat) {
		// Return a 3 letter abbreviation of the given stat name
		if (stat === 'speed') stat = 'spd';
		var show = stat.substr(0,3);
		return show.toUpperCase();
	},
	
	displayStats: function() {
		var result = '';
		for (var stat in this.lists.stats) {
			stat = this.lists.stats[stat].toLowerCase();
			var show = this.abbreviateStat(stat);
			result += '[' + show + '] ' + this.zipperStat(stat) + '\t(' + this.stats.race[stat] + ',' + this.stats.type[stat] + ',' + this.stats.mod[stat] + ')\n';
		}
		return result;
	},
	
	displayAbilities: function() {
		var result = 'Abilities:\n';
		for (var ability in this.abilities) {
			ability = this.abilities[ability];
			result += '\t- ' + ability.displayName() + '\n';
		}
		return result;
	},
	
	displayName: function(verbose) {
		function titleCase(str) {
			return str.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
		}

		var result = titleCase(this.gender) + ' ' + titleCase(this.titles.race) + ' ' + this.titles.type;
		return result;		
	},
	
	displayMeta: function() {
		var result = '[' + this.team.toUpperCase() + ':'+this.slot+'] '+this.element + ' ' + this.race + ' ' +this.type;
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
		var rand = Math.floor(Math.random() * this.lists.abilityTypes.length);
		return this.abilities[this.lists.abilityTypes[rand]].title;
	},
	
	tickConditions: function() {
		var message = 'No conditions';
		if (this.conditions.length > 0) {
			for (var i = 0; i < this.conditions.length; i++) {
				var effect = this.conditions[i];
				// duration = 0; Remove
				if (effect.duration == 0) {
					this.conditions[i] = null;
					message = this.title + ' lost the ' + effect.name + ' condition'; 

				}
				
				// duration > 0; Apply, tick down 
				if (effect.duration > 0) {
					switch (effect.stat) {
						case 'health':
							// Condition affects health stat
							if (!effect.amount) effect.amount = 1;
							if (effect.isPositive) {
								this.stats[effect.stat] += (effect.amount / effect.duration);
								console.log(this.title + ' healed by ' + effect.name + ' for ' + effect.amount); 
							} else {
								this.stats[effect.stat] -= (effect.amount / effect.duration);
								console.log(this.title + ' damaged by ' + effect.name + ' for ' + effect.amount); 

							}							
							break;
							
						case 'strength':
						case 'dexterity':
						case 'intellect':
						case 'wisdom':
						case 'vitality':
						case 'speed':
							// Condition effects stats
							if (!effect.applied) {
								if (effect.isPositive) {
									this.stats[effect.stat] += effect.amount;
									console.log(this.title + ' ' + effect.stat +' increased ' + effect.amount + ' by ' + effect.name); 
								} else {
									this.stats[effect.stat] -= effect.amount;
									console.log(this.title + ' ' + effect.stat +' decreased ' + effect.amount + ' by ' + effect.name); 
								}
								this.conditions[i].applied = true;
							}
							break;
						
						case 'defense':
						case 'attack':
							// Condition directly affects damage coming in or out
							
							break;
						
						default:
							// stat is null or other
							
							break;
						
					
					};
					this.conditions[i].duration --;
				}
			}
		}
	},
}