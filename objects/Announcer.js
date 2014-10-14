function Announcer() {
	this.target = config.variables.logging.logTarget;
	this.logLimit = config.variables.logging.logLimit;
	this.wrapper.element = config.variables.logging.wrapper.element;
	this.wrapper.class = config.variables.logging.wrapper.class;
	
	console.log('Announcer writing output to ' + this.target);
	
}

Announcer.prototype = {
	constructor: Announcer,
	
	target: '#battleLog',
	
	modes:	[ 'console', 'target' ],
	wrapper: {
		element: 'span',
		class: 'log',
	},
	_memory: [],
	
	wrap: function(message) {
		// Wraps messages in easily identifiable elements
		return '<'+this.wrapper.element+' class="'+this.wrapper.class+'">'+message+'</'+this.wrapper.element+'>\n';
	},
	
	out: function(message, mode) {
		this._memory.push(message);
		if (this._memory.length >= this.logLimit) {
			this._memory.pop();
		}
	
		// Will output via the specified mode
		switch (mode) {
			case 'console':
				console.log(message);
				break;
			case 'target':
			default:
				$(this.target).innerHTML = this.wrap(message);
				break;
		}
	},
	
	
	
}