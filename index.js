var ucfirst = require('ucfirst');
var Event = require('vue-events');

class Session {
	constructor() {
		this.data = [];

		this.flashData = {};
	}

	clearFlash() {
		this.flashData = {};
	}

	clear() {
		this.data = {};
	}

	flash(msg, type = 'success') {
		this.flashData[type.toLowerCase()] = msg;
	}

	getAllFlash() {
		return this.flashData;
	}
};

module.exports = {
	clearSession: {
		mounted: function() {
			if (this.$router == undefined) {return;}

			var vm = this;

			this.$router.afterEach((to, from) => {
				vm.$events.fire('messageClear');
				var messages = vm.$session.getAllFlash();
				Object.keys(messages).forEach(function(key) {
					vm.$events.fire('message'+ucfirst(key), messages[key]);
				});
				vm.$session.clearFlash();
			});
		}
	},
	session: {
		install: function(Vue, options) {
			Vue.use(Event.default);

			var s = new Session;

			Vue.mixin({
				beforeCreate() {
					Vue.prototype.$session = s;
				},
			});
		}
	}
}
