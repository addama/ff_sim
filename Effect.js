function Effect(type, element, target, baseDamage) {
	// type := 'damage', 'heal', 'dot', 'hot', 'buff', 'debuff'

	this.type = (config.validateEffect(type)) ? type : config.variables.defaults.effect;
	this.element = (config.validateElement(element)) ? element : config.variables.defaults.element;
	this.target = (config.validateTarget(target)) ? target : config.variables.defaults.target;
	this.baseDamage = baseDamage || config.variables.defaults.baseDamage;
	this.already = 0;
	this.duration = 1;
	
	this.title = (config.titles.effects[this.type][this.element]) ? config.titles.effects[this.type][this.element] : this.element + ' ' + this.type;
	
	switch (this.type) {
		case 'buff':
			this.buffTarget = (config.buffTargets[this.element]) ? config.buffTargets[this.element] : config.variables.defaults.stat;
			this.duration = config.variables.durations.buff;
			break;
		case 'debuff':
			this.buffTarget = (config.buffTargets[this.element]) ? config.buffTargets[this.element] : config.variables.defaults.stat;
			this.duration = config.variables.durations.debuff;
			break;
		case 'dot':
			this.duration = config.variables.durations.dot;
			break;
		case 'hot':
			this.duration = config.variables.durations.hot;
			break;
		default:
			break;
	}
	
}

Effect.prototype = {
	constructor: Effect,
	
	getGranularAmount: function() {
		// Used to determine how much healing/damage is applied per turn for hots/dots, or per target for selfParty/targetParty 
		// Damage and Heal types have a duration of 1, so their damage per unit is higher
		return this.baseDamage / this.duration;
	},
	
	getRemainingTicks: function() {
		return this.duration - this.already;
	},
	
	tick: function() {
		this.already += 1;
	},
	
	isAlive: function() {
		if (this.getRemainingTicks <= 0) {
			return false;
		}
		return true;
	},
}