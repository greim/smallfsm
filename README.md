Intro
=====

The `SmallFSM()` constructor exposed by this lib returns an object that can be used to represent and manipulate complex statefulness. It (more or less) follows the "finite state machine" pattern. Here's how you use it:

 * Grab a new instance and declare its beginning state.
 * Declare which state transitions are allowed (transitions involving >2 states are allowed), and optionally any actions or custom events for each allowed transition.
 * Set any custom event handlers.
 * Optionally set a callback to be run once when the machine first starts.
 * Execute transitions as necessary.

Dependencies
============

none

Examples
========

usage example 1, basic example:

    // get a new fsm instance with the given begin state
    var fsm = SmallFSM('loading');

    // declares 'loading' and 'ready' as allowed states
    // declares 'loading => ready' to be an allowed transition
    // sets a callback to be executed when the 'loading => ready' transition occurrs
    fsm.onTransit('loading => ready',function(){
        console.log('hello');
    });

    // push the machine into the 'ready' state
    // this will generate an error unless the current state is 'loading'
    fsm.transit('ready'); // 'hello' is printed

usage example 2, adding a begin callback:

    // the begin callback only ever runs once.
    // it will run automatically at the first transition or you can make it run explicitly
    // (note that onTransit() and allowTransit() are aliases of each other)
    SmallFSM('loading')
        .allowTransit('loading => ready')
        .onBegin(function(){
            console.log('begun');
        }).transit('ready'); // 'begun' is printed

    // also note methods can be chained

usage example 3, adding a custom event:

    // custom events aren't strictly necessary, but provide a nice abstraction.
    // transiting from 'loading' to 'ready' will trigger the 'readyToGo' event
    SmallFSM('loading')
        .onTransit('loading => ready',function(){
            console.log('hello');
        }, 'readyToGo')
        .on('readyToGo',function(){
            console.log('world');
        }).begin()
        .transit('ready'); // 'hello' and then 'world' are printed

usage example 4, passing contextual info:

    var fsm = SmallFSM('loading');

    // sometimes it's handy to have contextual info.
    // this info is passed both to the transition action and
    // to any custom events that it triggers
    // this is inspired by browsers' onevent=function(e){...} convention
    fsm.onTransit('loading => error',function(o){console.log(o.errMsg);});
    fsm.onTransit('loading => ready',function(){...});
    fsm.begin();
    fsm.transit('error',{errMsg:'file not found'});
    // 'file not found' is printed

usage example 5, tracking three or more state phases:

    var fsm = SmallFSM('loading');

    // only two-state transitions have been shown so far,
    // but three state (and higher) transitions are also allowed.
    // note: this will implicitly allow 'loading => ready' and 'ready => done' transitions
    fsm.onTransit('loading => ready => done',function(){
        console.log('the whole thing finished');
    });
    // will print to console when exactly that sequence occurrs

