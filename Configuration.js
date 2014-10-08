function Configuration() {
	this.loadConfiguration();
}

Configuration.prototype = {
	constructor: Configuration,
	configLocation: './config.json',
	isLoaded: false,
	
	loadConfiguration: function() {
		var app = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()	{
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var cfg = JSON.parse(xhr.responseText);
					for (var element in cfg) {
						app[element] = cfg[element];
					}
					this.isLoaded = true;
				} else {
					console.warn('Could not load ' + this.configLocation);
				}
			}
		};
		xhr.open("GET", this.configLocation, true);
		xhr.send();
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
	validateArchetype: function(archetype) {return (this.lists.archetypes.indexOf(archetype)) ? true : false},
	validateElement: function(element) {	return (this.lists.elements.indexOf(element)) ? true : false	},
	validateTarget: function(target) {		return (this.lists.targets.indexOf(target)) ? true : false 		},
	validateGender: function(gender) {		return (this.lists.genders.indexOf(gender)) ? true : false		},
	validateRace: function(race) {			return (this.lists.races.indexOf(race)) ? true : false			},
	validateStat: function(stat) {			return (this.lists.stats.indexOf(stat)) ? true : false			},
	validateEffect: function(effect) {		return (this.lists.effects.indexOf(effect)) ? true : false		},
	validateAbility: function(ability) {	return (this.lists.abilities.indexOf(ability)) ? true : false	},
	
	validateConfiguration: function() {
		// Checks the configuration to make sure that the items mentioned in the lists object are expanded upon in the other objects
		// This is important because other objects use the lists to know what's available to them
		
	},
	
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
	abbreviateStat: function(stat) {
		// Return a 3 letter abbreviation of the given stat name
		if (stat === 'speed') stat = 'spd';
		var show = stat.substr(0,3);
		return show.toUpperCase();
	},
	
	
}