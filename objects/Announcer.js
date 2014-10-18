function Announcer() {
	this.logLimit = config.variables.logging.logLimit;
	this.wrapper.element = config.variables.logging.wrapper.element;
	this.wrapper.class = config.variables.logging.wrapper.class;
	console.log('Announcer: Created with logLimit of ' + this.logLimit + ' as <' + this.wrapper.element + ' class="' + this.wrapper.class + '"></span>');
	this.register('default', config.variables.logging.logTarget);
}

Announcer.prototype = {
	constructor: Announcer,
	
	channels: {
		'console': {
			target: 'console.log',
			memory: [],
		},
		'debug': {
			target: 'console.debug',
			memory: [],
		},
		// this.register() will add channels to this list
	},
	wrapper: {},
		
	wrap: function(message) {
		// Wraps messages in easily identifiable elements
		return '<'+this.wrapper.element+' class="'+this.wrapper.class+'">'+message+'</'+this.wrapper.element+'><br />\n';
	},
	
	outputMemory: function(channel) {
		var result = '';
		if (this.channels[channel].memory) {
			for (var entry in this.channels[channel].memory) {
				result += this.channels[channel].memory[entry];
			}
			return result;
		} 
		return result;
	},
	
	out: function(message, channel) {
		// Sends a message to the given channel, or to the console
		if (!channel) channel = 'default';
		if (!this.channels[channel]) {
			console.warn('Announcer: Channel "' + channel + '" does not exist. Use Announcer.register(name, target) to register a new channel');
			return false;
		} 
		this.channels[channel].memory.push(this.wrap(message));
		if (this.channels[channel].memory.length >= this.logLimit) {
			var junk = this.channels[channel].memory.shift();
		}	
		// Will output via the specified mode
		switch (channel) {
			case 'console':
				console.log(message);
				break;
			case 'debug':
				console.debug(message);
				break;
			default:
				$('#'+this.channels[channel].target).innerHTML = this.outputMemory(channel);
		}
		return true;
	},
	
	group: function(array, channel) {
	
	},
	
	register: function(name, target) {
		// Creates a channel that is added to the "modes" list, which will send messages to the specified element
		// target cannot be "_target" or "_console"
		if (!this.channels[name]) {
			//if (target.substr(0,1) !== '#') target = '#' + target;
			this.channels[name] = {
				'target': target,
				'memory': [],
			}
			var newChannel = document.createElement('div');
			newChannel.id = target;
			$('#channels').appendChild(newChannel);
			console.log('Announcer: Registered channel "' + name + '" with output to element ID #' + target);
		}
	},
	
	
}