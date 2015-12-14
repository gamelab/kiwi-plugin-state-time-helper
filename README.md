State Time Helper Plugin
========================

	Version: 1.0.1
	Type: Animation helper
	Author: Benjamin D. Richards for Kiwi.js Team
	Website: www.kiwijs.org
	Kiwi.js Version Last Tested: 1.4.1

# Description

The State Time Helper adds clocks and tween managers to the state itself. This is useful for two reasons: stability and diversity.

State-based time functions are highly stable. If you create a time function, such as a `Timer` or `Tween`, use of game-based services such as `game.tweens` or `game.time.clock` may result in instability. This is because game-based services continue to run after the state has been destroyed, and may attempt to access destroyed data, resulting in exceptions and errors. State-based time services only run within the state, avoiding these common errors.

The helper can create several time systems in parallel. These allow you to decouple behaviours from a single control structure. For example, by default the helper creates a "ui" and a "world" time service. You could pause the "world" clock to quickly stop world objects moving, and still run the "ui" service to animate menu elements.

# Versions

## 1.0.1

- Add MIT license
- Fix bug that would not remove custom clocks when switching states
- Increase minimum Kiwi version to 1.4.1
- Clarify that `Component.destroy` is called automatically

## 1.0.0

Initial release

# Files and Folders

	build/			Plugin files, expanded and minified for your convenience
	docs/			Documentation of plugin API
	examples/		Example usage of plugin
	src/			Source files of plugin
	.gitignore		Git ignore prevents upload of working files
	gruntfile.js	Grunt tasks used to build plugin
	license.txt		How you may use this plugin
	package.json	Package data for Grunt
	readme.md		This file

# Usage

To load the State Time Helper plugin, simply include the plugin in your KiwiJS game. See below for details.

To add the plugin to a state, simply create a `Kiwi.Plugins.StateTimeHelper.Component` object during the `create` method. It will register itself.

Consult the `examples/` folder for a functional example.

## Including the Plugin

Add the plugin from the `build/` folder to your html file. Ensure you load it after the KiwiJS library:

```html
<script src="js/libs/kiwi.js"></script>
<script src="../build/state-time-helper-1.0.0.js"></script>
```

Include the plugin in your game options:

```js
var gameOptions = {
		plugins: [ "StateTimeHelper" ]
	};

var game = new Kiwi.Game( null, "game", null, gameOptions );
```

## Using the Helper

In your game state, create the helper component:

```js
this.timeHelper = new Kiwi.Plugins.StateTimeHelper.Component( {
	owner: this
} );
```

This will create the following objects on the game state:

* `this.clocks`
* `this.tweens`

These objects contain, respectively, clocks and tween managers. These are paired: all tween managers have a related clock by the same name. Adjusting the clock will adjust the behaviour of the associated tween manager.

By default, the time helper will create two pairs of `Clock` and `TweenManager` objects: `ui` and `world`. You may use these keys to access both clocks and tweens from the respective containers. For example, `this.clocks.ui.setTimeout()` or `this.tweens.world.create()`.

You may customise the clocks and tweens by specifying them during creation (overriding defaults), or by creating them afterwards.

```js
// Create custom keys
this.timeHelper = new Kiwi.Plugins.StateTimeHelper.Component( {
	owner: this,
	keys: [ "timestream1", "timestream2", "timestream3" ]
} );

// Add keys
this.timeHelper.create( "timestream4" );
```

You may access certain properties of all clocks or tween managers at once using the methods `getOnAllClocks`, `getOnAllTweens`, `setOnAllClocks`, `setOnAllTweens`, `runOnAllClocks`, and `runOnAllTweens`. For example:

```js
// Return an array of the names of all tween managers, e.g. [ "ui", "world" ]
Kiwi.Log.log( this.timeHelper.getOnAllTweens( "name") );

// Set the time scale on all clocks:
this.timeHelper.setOnAllClocks( "timeScale", 0.5 );

// Pause all clocks:
this.timeHelper.runOnAllClocks( "pause" );
```

Note that you cannot run all methods in this way. For example, you need to provide unique identifiers when creating tweens, so you cannot `runOnAllTweens( "create" )` to quickly animate all objects at once. You must instead use `for ( var i in this.tweens ) { this.tweens[ i ].create(); }` or similar patterns.

# Thank You

We hope you enjoy the State Time Helper Plugin. If you have any questions or issues, we welcome your input on the [KiwiJS website](http://www.kiwijs.org).
