/**
JavaScript finite state machine (FSM) library that uses an event-driven pattern
for state transitions.
@param startingState - Which state the machine starts in.
*/

var SmallFSM = (function(){

	/**
	@constructor - Returns an FSM instance.
	*/
	return function(startingState){

		var FSM = {};

		if (!startingState){
			throw new Error('no starting state provided');
		}

		var stateHist = []; // private var which tracks current state
		var states = {};
		var transitions = {}; // stores valid state transition
		var custEvents = {}; // stores custom events
		var beginFunc; // may contain a func that runs at startup
		var begun = false;
		var sep = '!';

		function emitCustom(eventName, eventObj){
			var evq = custEvents[eventName];
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
		FSM.onBegin = function(f){
			beginFunc = f;
			return FSM;
		};

		/**
		@method - Starts the machine.
		*/
		FSM.begin = function(){
			if (!begun) {
				states[startingState]=true;
				stateHist.push(startingState);
				if (beginFunc) {beginFunc();}
				begun = true;
			}
			return FSM;
		};

		/**
		@method - Gets the current state of the machine.
		*/
		FSM.getState = function(){
			return stateHist[stateHist.length-1];
		};

		/**
		@method - Sets a handler for for a given transition. Also causes the machine
		to remember this as an allowed transition.
		@param transition - A string like this "stateA => stateB" where stateA and
		stateB are states given in the constructor.
		@param action - The function to be executed.
		@param events - String containing space-separated list of custom events
		to be emitted when this transition occurrs.
		*/
		FSM.onTransit = FSM.allowTransit = function(transition, action, events, clobberable){
			if (transition.indexOf(sep)!=-1){
				throw new Error('transition string cannot contain "'+sep+'" character');
			}
			var tr = transition.split(/\s*=>\s*/);
			// clean up transition list and store the state
			for (var i=0;i<tr.length;i++){
				tr[i] = tr[i].replace(/^\s\s*/,'').replace(/\s\s*$/,'');
				states[tr[i]]=true;
			}
			// build string to internally store representation of transition
			var trStr = tr.join(sep);
			// populate all two-length transitions comprising transitions
			// of three or more but make them clobberable
			if (tr.length > 2) {
				for (var i=1;i<tr.length;i++){
					var newTransition = tr[i-1]+' => '+tr[i];
					FSM.onTransit(newTransition, null, null, true);
				}
			}
			var exst = !!transitions[trStr], // this transition already exists
			    clb = !!clobberable, // whether transition being added wants to be clobberable
			    write = !exst || (exst && !clb), // whether to write/overwrite this transition
			    err = exst && !clb && !transitions[trStr].clb; // whether to throw an error
			if (write) {
				transitions[trStr] = {
					pattern: new RegExp('(^|'+sep+')'+trStr+'$'),
					events: events?events.split(/\s+/):[],
					action: action,
					clb:!!clobberable
				};
			}
			if (err) {
				var errMsg = 'cannot overwrite "'+transition
					+'" transition, already exists'
				throw new Error(errMsg);
			}
			return FSM;
		};

		/**
		@method - Sets a handler for a custom event.
		*/
		FSM.on = function(event, action){
			var evq = custEvents[event];
			if (!evq) { custEvents[event] = evq = []; }
			evq.push(action);
			return FSM;
		};

		/**
		@method - Pushes the machine into a new state.
		@throws Error - If the state wasn't declared in the constructor or if
		it isn't an allowed transition.
		*/
		FSM.transit = function(toState, event){
			if (!begun) { FSM.begin(); }
			event = event || {};
			var matchFound=false;
			hStr = stateHist.join(sep)+sep+toState;
			for (var trs in transitions) {
				if(!transitions.hasOwnProperty(trs)){continue;}
				var tr=transitions[trs];
				if (tr.pattern.test(hStr)){
					matchFound=true;
					if (tr.action) { tr.action(event); }
					for (var i=0;i<tr.events.length;i++){
						emitCustom(tr.events[i],event);
					}
				}
			}
			if(!matchFound){
				if(!states[toState]) {
					throw new Error('"'+toState+'" is not a valid state');
				} else {
					throw new Error('"'+FSM.getState()+' => '+toState+'" is not a valid transition');
				}
			} else {
				stateHist.push(toState);
				if (stateHist.length > 64) {
					stateHist.splice(0,8);
				}
			}
			return FSM;
		};

		return FSM;
	};

})();
