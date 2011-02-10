usage example 1, basic example:

    var fsm = new SmallFSM(['loading','ready','done']);
    fsm.onTransit('loading => ready',function(){...});
    fsm.begin();
    fsm.transit('ready'); // function is executed

usage example 2, adding a custom event:

    var fsm = new SmallFSM(['loading','ready','done']);
	fsm.onTransit('loading => ready',function(){...},'readyToGo');
	fsm.on('readyToGo',function(){...});
	fsm.begin();
	fsm.transit('ready'); // two functions executed

usage example 3, passing an extra arg:

	var fsm = new SmallFSM(['loading','ready','error','done']);
	fsm.onTransit('loading => ready',function(){...});
	fsm.onTransit('loading => error',function(o){console.log(o.errMsg);});
	fsm.begin();
	fsm.transit('error',{errMsg:'file not found'}); // object is passed as extra arg

