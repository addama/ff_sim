function Configuration() {
	this.loadConfiguration();
	this.loadNames();
}

Configuration.prototype = {
	constructor: Configuration,
	configLocation: './config.json',	// This location is relative to index.htm
	namesLocation: './names.json',		
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
	
	loadNames: function() {
		var app = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()	{
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var cfg = JSON.parse(xhr.responseText);
					for (var element in cfg) {
						app[element] = cfg[element];
					}
				} else {
					console.warn('Could not load ' + this.namesLocation);
				}
			}
		};
		xhr.open("GET", this.namesLocation, true);
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
	
	getRandomName: function(race, gender) {
		var rand = Math.floor(Math.random() * this.lists.names[race][gender].length);
		return this.lists.names[race][gender][rand];
	},

	
	
	// Validation functions
	validateArchetype: function(archetype) {return (this.lists.archetypes.indexOf(archetype) !== -1) ? true : false},
	validateElement: function(element) {	return (this.lists.elements.indexOf(element) !== -1) ? true : false	},
	validateTarget: function(target) {		return (this.lists.targets.indexOf(target) !== -1) ? true : false 		},
	validateGender: function(gender) {		return (this.lists.genders.indexOf(gender) !== -1) ? true : false		},
	validateRace: function(race) {			return (this.lists.races.indexOf(race) !== -1) ? true : false			},
	validateStat: function(stat) {			return (this.lists.stats.indexOf(stat) !== -1) ? true : false			},
	validateEffect: function(effect) {		return (this.lists.effects.indexOf(effect) !== -1) ? true : false		},
	validateAbility: function(ability) {	return (this.lists.abilities.indexOf(ability) !== -1) ? true : false	},
	
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
	
	makeNewName: function(race, gender) {
		if (config.lists.nameParts[race]) {
			switch(config.variables.names.minParts) {
			
			}
		} else if (config.lists.names[race][gender]) {
			return this.getRandomName(race, gender);
		}
	},
	
	generateName: function(race, gender) {
		// Generate names using 2 methods: picking a random name from a list, or building a name from race-specific parts
		// Built names will attempt to build using a parts list from config.lists, and barring that, will default to a static name list
		// Both built and randomized names will default to a no-name if their respective arrays aren't found
		switch(race) {
			// Random names
			case 'human':
				return this.getRandomName(race, gender);
				break;
				
			// Built names
			case 'dwarf':
				return this.makeNewName(race, gender);
				break;
			default:
				return 'anonymous';
				break;
		}
	},
	
	generateChannelName: function(object) {
		// The added number should be 1 less than the multiplied number to ensure good randomness
		return Math.floor((Math.random() * 100000000000000) + 10000000000000 + '00000000000000000000000000000000000000000000000000000000').toString(36);
	},
}