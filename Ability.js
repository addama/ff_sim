function Ability(type) {
	//console.log('[ABILITY] ' + type);
	this.type = (config.validateAbility(type)) ? type : 'attack'
	this.title = config.titles.abilities[type];
	this.element = (config.abilityElements[type]) ? config.abilityElements[type] : this.type;
	this.baseDamage = (config.abilities[type].baseDamage) ? config.abilities[type].baseDamage : config.variables.defaults.baseDamage;
	this.effect = (config.abilities[type].effect.type) ? config.abilities[type].effect.type : config.variables.defaults.effect;
	this.target = (config.abilities[type].effect.target) ? config.abilities[type].effect.target : config.variables.defaults.target;
	
	//console.log(this.displayName());
};

Ability.prototype = {
	constructor: Ability,
	
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