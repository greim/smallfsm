This grew out of an experimental attempt to build an HTML5 video API. A video is
a complex, stateful object that can be interacted with differently depending on
which state it's currently in. Plus, I needed to tie in metrics, so it wasn't
enough just to know when it was playing, I also needed to know if it had been
played from the beginning or resumed after pause, etc. I finally decided a
finite state machine was the only to keep sanity in the code. I don't know if
this is a Proper FSM implementation that would satisfy the comp-sci elite, but I
like it because it feels "eventy" and it does what I need.

usage example 1, basic example:

    // get a new fsm instance with the given allowable states
    // first state given is starting state
    var fsm = new SmallFSM(['loading','ready','done']);

    // declares a given transition to be allowable and also
    // sets an action to be performed whenever that happens
    fsm.onTransit('loading => ready',function(){...});

    // places the machine into its starting statet
    fsm.begin();

    // attempt to push the machine into the 'ready' state
    fsm.transit('ready'); // function is executed

usage example 2, adding a custom event:

    var fsm = new SmallFSM(['loading','ready','done']);

    // custom events aren't strictly necessary, but provide a nice abstraction.
    // now, transiting from 'loading' to 'ready' will trigger the 'readyToGo' event
    // in addition to executing the action
	fsm.onTransit('loading => ready',function(){...},'readyToGo');
	fsm.on('readyToGo',function(){...});
	fsm.begin();
	fsm.transit('ready'); // two functions executed

usage example 3, passing contextual info:

	var fsm = new SmallFSM(['loading','ready','error','done']);

    // sometimes it's handy to have contextual info.
    // this info is passed both to the transition action and
    // to any custom events that it triggers
    // this is inspired by browsers' onevent=function(e){...} convention
	fsm.onTransit('loading => error',function(o){console.log(o.errMsg);});
	fsm.onTransit('loading => ready',function(){...});
	fsm.begin();
	fsm.transit('error',{errMsg:'file not found'}); // object is passed as extra arg

