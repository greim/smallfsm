Intro
=====

Google is your friend if you want to know what FSMs are, however I suppose you wouldn't be here if you didn't have some inkling. Suffice to say, they help model the evolving state of complex, real-world things on your program, such as a video on a web page or a tech support call.

Dependencies
============

none

Examples
========

usage example 1, basic example:

    // get a new fsm instance with the given allowable states
    // first state given is starting state
    var fsm = new SmallFSM(['loading','ready','done']);

    // declares a given transition to be allowable and also
    // sets an action to be performed whenever that happens
    fsm.onTransit('loading => ready',function(){...});

    // places the machine into its starting state
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

