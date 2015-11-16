/**
* State Time Helper
*
* This helper adds a pair of linked managers to a `State`.
* These helpers are `clocks` and `tween`.
* You may access the helper to create a `Clock`/`TweenManager` pair.
* This pair is automatically linked, so each clock has associated tweens,
* and each tween manager runs on its own clock.
* The clock can also run timer functions.
*
* The helper runs as a state component to ensure that
* tween managers are updated.
*
* By default, the helper creates `ui` and `world` pairs.
* These are sufficient for the vast majority of timing purposes.
*
* @module Kiwi
* @submodule Plugins
* @namespace Kiwi.Plugins
* @class StateTimeHelper
*/

Kiwi.Plugins.StateTimeHelper = {
	name: "StateTimeHelper",
	version: "1.0.0",
	minimumKiwiVersion: "1.4.0",
	pluginDependencies: []
};
Kiwi.PluginManager.register( Kiwi.Plugins.StateTimeHelper );

Kiwi.Plugins.StateTimeHelper.create = function( game ) {
	Kiwi.Log.log( "StateTimeHelper created" );
};


/**
* @namespace Kiwi.Plugins.StateTimeHelper
*/


Kiwi.Plugins.StateTimeHelper.Component = function( params ) {

	/**
	* This component manages time helper functions
	* and serves as central control.
	*
	* This component will automatically register itself to the owner,
	* and create `clocks` and `tweens` properties on the owner.
	* You may create clocks and tween managers using `create`.
	* If you do not specify keys, it will automatically create
	* `ui` and `world` clocks/tween managers.
	*
	* The component will automatically update tween managers.
	*
	* You may get, set, and run properties and functions on the entire
	* list of clocks or tweens using functions. This may be useful for
	* diagnostic purposes. Not all functions can be easily accessed
	* in this way, but for some like `isPaused()` it is a convenient shortcut.
	*
	* @class Component
	* @constructor
	* @param params {object} Composite parameter object
	*	@param params.owner {Kiwi.Entity} Owner of the helper, ideally a State
	*	@param [params.keys=["ui","world"]] {array} List of names of
	*		`Clock`/`TweenManager` pairs to create
	*	@param [params.maxFrameDuration=100] {number} Maximum frame duration
	*		for clocks
	*	@param [params.state] {Kiwi.State} Alias for `owner`, as this is
	*		usually added to a state
	* @return Kiwi.Plugins.StateTimeHelper.Component
	*/

	var i;

	if ( params.state && !params.owner ) {
		params.owner = params.state;
	}

	Kiwi.Component.call( this, params.owner, "StateTimeHelper" );

	params.owner.components.add( this );

	/**
	* Clock storage, mirrored on `owner`
	* @property clocks
	* @type object
	* @default {}
	*/
	this.clocks = {};
	this.owner.clocks = this.clocks;

	/**
	* Tween storage, mirrored on `owner`
	* @property tweens
	* @type object
	* @default {}
	*/
	this.tweens = {};
	this.owner.tweens = this.tweens;

	// Create key pairs
	if ( !params.keys ) {
		params.keys = [ "ui", "world" ];
	}
	for ( i in params.keys ) {
		this.create( params.keys[ i ] );
	}

	// Set maxframes
	for ( i in this.clocks ) {
		this.clocks[ i ].maxFrameDuration = params.maxFrameDuration || 100;
	}

	return this;
};
Kiwi.extend( Kiwi.Plugins.StateTimeHelper.Component, Kiwi.Component );


Kiwi.Plugins.StateTimeHelper.Component.prototype.create = function( key ) {

	/**
	* Create a `Clock`/`TweenManager` pair.
	* Link and register them.
	*
	* @method create
	* @param key {string} Access key for the pair on `clocks` and `tweens`.
	*/

	var clock, tween;

	if ( typeof key !== "string" ) {
		Kiwi.Log.error(
			"#StateTimeHelper",
			"could not create invalid key name" );
		return;
	}

	if ( this.clocks[ key ] || this.tweens[ key ] ) {
		Kiwi.Log.error(
			"#StateTimeHelper",
			"could not create Clock/TweenManager with key",
			key,
			"as it already exists." );
		return;
	}

	clock = this.owner.game.time.addClock( key );
	tween = new Kiwi.Animations.Tweens.TweenManager( this.game, clock );

	this.clocks[ key ] = clock;
	this.tweens[ key ] = tween;

	clock.start();
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.getOnAllClocks =
	function( property ) {

	/**
	* Return a list of the property on all clocks.
	* @method getOnAllClocks
	* @param property {string} Name of the property to read
	* @return array
	*/

	var i,
		array = [];

	for ( i in this.clocks ) {
		array.push( this.clocks[ i ][ property ] );
	}

	return array;
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.getOnAllTweens =
	function( property ) {

	/**
	* Return a list of the property on all tween managers.
	* @method getOnAllTweens
	* @param property {string} Name of the property to read
	* @return array
	*/

	var i,
		array = [];

	for ( i in this.tweens ) {
		array.push( this.tweens[ i ][ property ] );
	}

	return array;
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.runOnAllClocks =
	function( property ) {

	/**
	* Execute the specified method on all clocks.
	* Additional parameters will be passed to the functions.
	* This returns a list of any return values.
	* @method runOnAllClocks
	* @param property {string} Name of the function to call
	* @return {array} List of function returns
	*/

	var i,
		args = [],
		returns = [];

	for ( i = 1; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}

	for ( i in this.clocks ) {
		returns.push(
			( this.clocks[ i ][ property ] ).apply( this.clocks[ i ], args ) );
	}

	return returns;
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.runOnAllTweens =
	function( property ) {

	/**
	* Execute the specified method on all tween managers.
	* Additional parameters will be passed to the functions.
	* This returns a list of any return values.
	* @method runOnAllClocks
	* @param property {string} Name of the function to call
	* @return {array} List of function returns
	*/

	var i,
		args = [],
		returns = [];

	for ( i = 1; i < arguments.length; i++ ) {
		args.push( arguments[ i ] );
	}

	for ( i in this.tweens ) {
		returns.push(
			( this.tweens[ i ][ property ] ).apply( this.tweens[ i ], args ) );
	}

	return returns;
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.setOnAllClocks =
	function( property, value ) {

	/**
	* Set the property on all clocks.
	* @method setOnAllClocks
	* @param property {string} Name of the property to set
	* @param value {any} Value to set
	*/

	var i;

	for ( i in this.clocks ) {
		this.clocks[ i ][ property ] = value;
	}
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.setOnAllTweens =
	function( property, value ) {

	/**
	* Set the property on all tween managers.
	* @method setOnAllTweens
	* @param property {string} Name of the property to set
	* @param value {any} Value to set
	*/

	var i;

	for ( i in this.tweens ) {
		this.tweens[ i ][ property ] = value;
	}
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.update = function() {

	/**
	* Call every frame. Override default `Component.update`.
	* @method update
	*/

	var i;

	for ( i in this.tweens ) {
		this.tweens[ i ].update();
	}
};


Kiwi.Plugins.StateTimeHelper.Component.prototype.destroy = function() {

	/**
	* Clean up time components to avoid end-of-state errors.
	* @method destroy
	*/

	var i, j;

	this.runOnAllClocks( "stop" );
	for ( i in this.tweens ) {
		this.tweens[ i ].removeAll();
	}

	// Somewhat naughty clock removal.
	// This violates privacy,
	// but it also prevents accumulation of orphan clocks.
	for ( i = this.clocks.length - 1; i >= 0; i-- ) {
		for ( j in this.clocks ) {
			if ( this.game.time._clocks[ i ] === this.clocks[ j ] ) {
				this.game.time._clocks.splice( i, 1 );
				break;
			}
		}
	}

	Kiwi.Component.prototype.destroy.call( this );
};
