var gameOptions = {
		// renderer: Kiwi.RENDERER_CANVAS,
		width: 800,
		height: 600,
		// scaleType: Kiwi.Stage.SCALE_FIT,
		// deviceTarget: Kiwi.TARGET_COCOON,
		plugins: [ "Primitives", "StateTimeHelper" ]
	},
	Example = {};

Example.game = new Kiwi.Game( null, "game", null, gameOptions );


Example.state = new Kiwi.State( "state" );


Example.state.preload = function() {

	Kiwi.State.prototype.preload.call( this );
};


Example.state.create = function() {

	Kiwi.State.prototype.create.call( this );

	this.game.stage.color = "ccc";

	// Create time helper
	this.timeHelper = new Kiwi.Plugins.StateTimeHelper.Component( {
		owner: this
	} );
	this.timeHelper.create( "three" );

	// Adjust time streams for demonstration purposes
	this.clocks.world.timeScale = 0.5;
	this.clocks.three.timeScale = 2;

	// Create objects to use time helper
	this.blockUi = new Kiwi.Plugins.Primitives.Rectangle( {
		state: this,
		x: 150,
		y: 100,
		width: 100,
		height: 100,
		color: [ 1.0, 0.3, 0.1 ],
		strokeColor: [ 0.5, 0.15, 0.05 ]
	});

	this.blockWorld = new Kiwi.Plugins.Primitives.Rectangle( {
		state: this,
		x: 350,
		y: 100,
		width: 100,
		height: 100,
		color: [ 0.1, 1.0, 0.3 ],
		strokeColor: [ 0.05, 0.5, 0.15 ]
	});

	this.block3 = new Kiwi.Plugins.Primitives.Rectangle( {
		state: this,
		x: 550,
		y: 100,
		width: 100,
		height: 100,
		color: [ 0.3, 0.1, 1.0 ],
		strokeColor: [ 0.15, 0.05, 0.5 ]
	});

	// Assign custom clocks
	this.blockUi.clock = this.clocks.ui;
	this.blockWorld.clock = this.clocks.world;
	this.block3.clock = this.clocks.three;

	// Assign custom tween managers
	this.blockUi.tweens = this.tweens.ui;
	this.blockWorld.tweens = this.tweens.world;
	this.block3.tweens = this.tweens.three;

	// Create scene hierarchy
	this.addChild( this.blockUi );
	this.addChild( this.blockWorld );
	this.addChild( this.block3 );

	// Assign inputs
	this.blockUi.input.onUp.add( function() {
		this.bounce( this.blockUi );
	}, this );
	this.blockWorld.input.onUp.add( function() {
		this.bounce( this.blockWorld );
	}, this );
	this.block3.input.onUp.add( function() {
		this.bounce( this.block3 );
	}, this );
};


Example.state.update = function() {

	Kiwi.State.prototype.update.call( this );

	// Move all objects based on their own clocks
	this.oscillate( this.blockUi );
	this.oscillate( this.blockWorld );
	this.oscillate( this.block3 );
};


Example.state.oscillate = function( block ) {

	/**
	* Move a block according to its internal clock.
	*
	* @method oscillate
	* @param block {Kiwi.Entity} Block to move
	*/

	block.y = ( this.game.stage.height / 2 ) +
		100 * -Math.cos( block.clock.elapsed() ) -
		block.height / 2;
};


Example.state.bounce = function( block ) {

	/**
	* Cause a block to do a distinctive tween.
	* @method bounce
	* @param block {Kiwi.Entity} Block to bounce
	*/

	var tween;

	block.scale = 0.75;
	block.rotation = 0.1;

	tween = block.tweens.create( block );

	tween.to(
		{ scaleX: 1, scaleY: 1, rotation: 0 },
		1000,
		Kiwi.Animations.Tweens.Easing.Elastic.Out,
		true );
};


Example.game.states.addState( Example.state );
Example.game.states.switchState( "state" );
