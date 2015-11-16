YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Kiwi.Plugins.StateTimeHelper",
        "Kiwi.Plugins.StateTimeHelper.Component"
    ],
    "modules": [
        "Kiwi",
        "Plugins"
    ],
    "allModules": [
        {
            "displayName": "Kiwi",
            "name": "Kiwi"
        },
        {
            "displayName": "Plugins",
            "name": "Plugins",
            "description": "State Time Helper\n\nThis helper adds a pair of linked managers to a `State`.\nThese helpers are `clocks` and `tween`.\nYou may access the helper to create a `Clock`/`TweenManager` pair.\nThis pair is automatically linked, so each clock has associated tweens,\nand each tween manager runs on its own clock.\nThe clock can also run timer functions.\n\nThe helper runs as a state component to ensure that\ntween managers are updated.\n\nBy default, the helper creates `ui` and `world` pairs.\nThese are sufficient for the vast majority of timing purposes."
        }
    ]
} };
});