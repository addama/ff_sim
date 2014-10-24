function Ability(type) {
	this.type = (config.validateAbility(type)) ? type : 'attack'
	this.title = config.titles.abilities[type];
	this.element = (config.abilityElements[type]) ? config.abilityElements[type] : this.type;
	this.cooldown = (config.abilities[type].cooldown) ? config.abilities[type].cooldown : config.variables.defaults.cooldown;
	this.baseDamage = (config.abilities[type].baseDamage) ? config.abilities[type].baseDamage : config.variables.defaults.baseDamage;
	this.effect = (config.abilities[type].effect.type) ? config.abilities[type].effect.type : config.variables.defaults.effect;
	this.target = (config.abilities[type].effect.target) ? config.abilities[type].effect.target : config.variables.defaults.target;
	this.already = 0;
	this.onCooldown = false;
	this.payLoad = this.makeEffect();
};

Ability.prototype = {
	constructor: Ability,
	
	displayName: function(verbose) {
		function titleCase(str) {
			return str.replace(/\b\w+/g,function(s){return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();});
		}
		
		var result = titleCase(this.title) + ' (' + this.element + ' ' + this.effect + ')';
		return result;
	},
	
	displayStats: function() {
		if (this.payLoad.type === 'dot') {
			result = 'Causes ' + this.payLoad.getGranularAmount() + ' ' + this.element + ' damage to ' + this.target + ' every turn for ' + this.payLoad.duration + ' turns'; 
		}
		
		if (this.payLoad.type === 'hot') {
			result = 'Heals ' + this.target + ' for ' + this.payLoad.getGranularAmount() + ' damage every turn for ' + this.payLoad.duration + ' turns'; 
		}
		
		if (this.payLoad.type === 'buff') {
			result = 'Applies a ' + this.payLoad.buffTarget + ' buff to ' + this.target + ' for ' + this.payLoad.duration + ' turns'; 
		}
		
		if (this.payLoad.type === 'debuff') {
			result = 'Applies a ' + this.payLoad.buffTarget + ' debuff to ' + this.target + ' for ' + this.payLoad.duration + ' turns'; 
		}
		
		if (this.payLoad.type === 'heal') {
			result = 'Heals ' + this.target + ' for ' + this.payLoad.getGranularAmount() + ' damage'; 
		}
		
		if (this.payLoad.type === 'damage') {
			result = 'Deals ' + this.payLoad.getGranularAmount() + ' ' + this.payLoad.element + ' damage to ' + this.target; 
		}
		return result;
		
	},
	
	makeEffect: function() {
		var effect = new Effect(this.effect, this.element, this.target, this.baseDamage);
		return effect;
	},
	
	tick: function() {
		if (this.onCooldown && this.already === this.cooldown) {
			this.already = 0;
			this.onCooldown = false;
		} else if (this.onCooldown) {
			this.already += 1;
			this.onCooldown = true;
		} else {
			// Nothing
		}
	},
}