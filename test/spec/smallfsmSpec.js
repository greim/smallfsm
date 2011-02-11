describe('SmallFSM', function(){
	it('should instantiate without error', function(){
		var f = new SmallFSM('foo');
	});
	it('should instantiate with error if no starting state', function(){
		try{ var f = new SmallFSM(); }
		catch(err){ var e = err; }
		expect(e).toBeDefined();
	});
	it('should run the begin function', function(){
		var x=false;
		new SmallFSM('foo').onBegin(function(){x=true;}).begin();
		expect(x).toEqual(true);
	});
	it('should begin without a function', function(){
		new SmallFSM('foo').begin();
	});
	it('should fail if transit is called with no transitions defined', function(){
		var f = new SmallFSM('foo').begin();
		try{f.transit('bar');}
		catch(err){var e = err;}
		expect(e).toBeDefined();
	});
	it('should fail if transit is called with invalid state', function(){
		var f = new SmallFSM('foo');
		f.onTransit('foo => bar',function(){}).begin();
		try{f.transit('baz');}
		catch(err){var e = err;}
		expect(e).toBeDefined();
	});
	it('should fail if transit is called with invalid transition', function(){
		var f = new SmallFSM('foo').onTransit('foo => bar => baz',function(){}).begin();
		try{f.transit('baz');}
		catch(err){var e = err;}
		expect(e).toBeDefined();
	});
	it('should allow action to be undefined', function(){
		new SmallFSM('foo')
			.onTransit('foo => bar')
			.transit('bar');
	});
	it('should alias allowTransit to onTransit', function(){
		new SmallFSM('foo')
			.allowTransit('foo => bar')
			.transit('bar');
	});
	it('should run a valid transition', function(){
		var x = false;
		new SmallFSM('foo')
			.onTransit('foo => bar',function(){x=true;})
			.transit('bar');
		expect(x).toEqual(true);
	});
	it('should run three-part transition', function(){
		var x = false;
		new SmallFSM('foo')
			.onTransit('foo => bar => baz',function(){x=true;})
			.transit('bar')
			.transit('baz');
		expect(x).toEqual(true);
	});
	it('should be callable with or without new keyword', function(){
		new SmallFSM('foo')
			.allowTransit('foo => bar => baz')
			.transit('bar')
			.transit('baz');
		SmallFSM('foo')
			.allowTransit('foo => bar => baz')
			.transit('bar')
			.transit('baz');
	});
	it('should be flexible with whitespace', function(){
		var x = false;
		new SmallFSM('foo')
			.onTransit('  foo=>\nbar	 => baz=>bip\n\n',function(){x=true;})
			.transit('bar')
			.transit('baz')
			.transit('bip');
		expect(x).toEqual(true);
	});
	it('should fire a custom event', function(){
		var x = false;
		SmallFSM('foo')
			.onTransit('foo => bar => baz',function(){},'didit')
			.on('didit',function(){x=true;})
			.transit('bar')
			.transit('baz');
		expect(x).toEqual(true);
	});
	it('should pass context objects', function(){
		var x = '';
		SmallFSM('foo')
			.onTransit('foo => bar => baz',function(e){x+='A'+e.foo;},'didit')
			.on('didit',function(e){x+='B'+e.foo;})
			.transit('bar')
			.transit('baz',{foo:'-'});
		expect(x).toEqual('A-B-');
	});
});
