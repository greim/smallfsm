/**
JavaScript finite state machine (FSM) library that uses an event-driven pattern
for state transitions.
*/

var SmallFSM = (function(){

	/**
	@constructor - Returns an FSM instance.
	@param stateList - List of strings declaring states this FSM can be in. The first element is the starting state. Beyond that, order doesn't matter.
	*/
	return function(stateList){

		var state = null; // private var which tracks current state
		var states = {}; // stores valid state transition
		var events = {}; // stores custom events
		var beginFunc; // may contain a func that runs at startup

		// initialize states
		for(var i=0;i<stateList.length;i++){
			states[stateList[i]] = {};
		}
		for (var fromState in states) {
			for (var toState in states) {
				if (states.hasOwnProperty(toState)){
					states[fromState][toState] = false;
				}
			}
		}

		function emit(eventName, eventObj){
			var evq = events[eventName];
			if (evq) {
				for (var i=0; i<evq.length; i++) {
					evq[i](eventObj);
				}
			}
		};

		// external api

		/**
		@method - Optionally function to set a callback to run when the
		machione starts.
		*/
		this.onBegin = function(f){
			beginFunc = f;
		};

		/**
		@method - Starts the machine.
		*/
		this.begin = function(){
			state = stateList[0];
			if (beginFunc) { beginFunc(); }
		};

		/**
		@method - Gets the current state of the machine.
		*/
		this.getState = function(){return state;};

		/**
		@method - Sets a handler for for a given transition. Also causes the machine
		to remember this as an allowed transition.
		@param transition - A string like this "stateA => stateB" where stateA and
		stateB are states given in the constructor.
		@param action - The function to be executed.
		@param events - String containing space-separated list of custom events
		to be emitted when this transition occurrs.
		*/
		this.onTransit = function(transition, action, events){
			transition = transition.split(/\s*=>\s*/);
			var from = transition[0], to = transition[1];
			states[from][to] = {
				events: (events || '').split(/\s+/g),
				action: action
			};
		};

		/**
		@method - Sets a handler for a custom event.
		*/
		this.on = function(event, action){
			var evq = events[event];
			if (!evq) { events[event] = evq = []; }
			evq.push(action);
		};

		/**
		@method - Pushes the machine into a new state.
		@throws Error - If the state wasn't declared in the constructor or if
		it isn't an allowed transition.
		*/
		this.transit = function(toState, event){
			event = event || {};
			try {
				var tr = states[state][toState];
				if (!tr) { throw new Error('invalid state'); }
				state = toState;
				if (tr.action) { tr.action(event); }
				var events = tr.events;
				for (var i=0; i<events.length; i++){
					emit(events[i], event);
				}
			} catch (err) {
				throw new Error('player state error: '+err);
			}
		};

		return this;
	}

})();
