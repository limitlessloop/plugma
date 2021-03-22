'use strict';

var name = "Test-Plugin";
var version = "1.0.0";
var description = "Your Figma plugin";
var main = "code.js";
var scripts = {
	build: "rollup -c",
	dev: "rollup -c -w"
};
var author = "";
var license = "";
var devDependencies = {
	"@figma/plugin-typings": "^1.19.2",
	"@rollup/plugin-commonjs": "^17.1.0",
	"@rollup/plugin-replace": "^2.4.1",
	"@rollup/plugin-typescript": "^8.2.0",
	"@types/node": "^14.14.35",
	rollup: "^2.41.5",
	"rollup-plugin-node-globals": "^1.4.0",
	"rollup-plugin-node-polyfills": "^0.2.1",
	"rollup-plugin-terser": "^7.0.2",
	typescript: "^4.2.3"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	author: author,
	license: license,
	devDependencies: devDependencies
};

// TODO: Check package from working directory
// TODO: Check versions from working directory
// TODO: How to fix issue of referenceing file when used as depency
// import pkg from '../package.json';
// import versionHistory from './versions.json';
// import semver from 'semver';


// fs.readFile("../package.json", (err, data) => {
// 	console.log(err, data)
// })
// const file = require("package.json")
// console.log(file)
// function updateAvailable() {
// 	var currentVersion = figma.root.getPluginData("pluginVersion") || pkg.version;
// 	var newVersion = pkg.version;
// 	if (semver.gt(newVersion, currentVersion)) {
// 		return true
// 	}
// 	else {
// 		false
// 	}
// }
function plugma(plugin) {
    var pluginState = {
        version: pkg.version,
        updateAvailable: false,
        ui: {}
    };
    // pluginState.updateAvailable = updateAvailable()
    var eventListeners = [];
    pluginState.on = (type, callback) => {
        eventListeners.push({ type, callback });
    };
    // Override default page name if set
    var pageMannuallySet = false;
    pluginState.setStartPage = (name) => {
        pluginState.ui.page = name;
        pageMannuallySet = true;
    };
    // pluginState.update = (callback) => {
    // 	for (let [version, changes] of Object.entries(versionHistory)) {
    // 		if (version === pkg.version) {
    // 			// for (let i = 0; i < changes.length; i++) {
    // 			// 	var change = changes[i]
    // 			// }
    // 			callback({ version, changes })
    // 		}
    // 	}
    // }
    var pluginCommands = plugin(pluginState);
    // // Override default page name if set
    // if (pageName[0]) {
    // 	pluginState.ui.page = pageName[0]
    // }
    // console.log("pageName", pluginState.ui.page)
    Object.assign({}, pluginState, { commands: pluginCommands });
    if (pluginCommands) {
        for (let [key, value] of Object.entries(pluginCommands)) {
            // If command exists in manifest
            if (figma.command === key) {
                // Pass default page for ui
                if (!pageMannuallySet) {
                    pluginState.ui.page = key;
                }
                // Override default page name if set
                // if (pageName[0]) {
                // 	pluginState.ui.page = pageName[0]
                // }
                // Call function for that command
                value(pluginState);
                // Show UI?
                if (pluginState.ui.open) {
                    console.log("open?");
                    figma.showUI(pluginState.ui.html);
                }
            }
        }
    }
    figma.ui.onmessage = message => {
        for (let eventListener of eventListeners) {
            // console.log(message)
            if (message.type === eventListener.type)
                eventListener.callback(message);
        }
    };
    // console.log(pluginObject)
}

var dist = plugma;

dist((plugin) => {
    console.log(plugin);
    figma.showUI(__html__);
    plugin.on('create-rectangles', (msg) => {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
rect.setPluginData("version", "1.0.0");            const rect2 = figma.createRectangle();
rect2.setPluginData("version", "1.0.0");            console.log(rect2);
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
        figma.closePlugin();
    });
    plugin.on('cancel', () => {
        figma.closePlugin();
    });
    return {
        'createRectangles': () => {
            console.log("test");
        }
    };
});
