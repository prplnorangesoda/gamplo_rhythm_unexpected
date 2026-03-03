import { Application, Text, TickerPlugin, extensions } from "pixi.js";
import { is_dev } from "./env";
import GameManager, { SCREEN_MAP } from "./game";
import { setup_sync } from "./gamplo_sync";
import log from "./log";
import { Colors } from "./colors";
import { createSystems } from "./systems/system";
import type { ScreenSwitchEvent } from "./systems/nav";
import { sound } from "@pixi/sound";
import { sleep } from "./sleep";
import { sys } from "typescript";

// console.log("Hello via Bun!");
setup_sync();

log("Running under development:", is_dev);
main();

let fps: Text | undefined;
async function main() {
	log("running main");

	const app = new Application();
	const systems = createSystems(app);

	Object.defineProperty(window, "systems", { value: systems });
	const pin = document.getElementById("pin")!;
	await app.init({
		background: Colors.BG,
		resizeTo: pin,
		hello: true,
		autoStart: false, // disable default ticker
	});
	document.body.appendChild(app.canvas);

	const game = new GameManager(app, systems);

	let fps_text = new Text({
		text: "FPS",
		style: { fill: "lime", fontSize: 12 },
	});
	app.stage.addChild(fps_text);
	fps = fps_text;
	game.init();
	sound.disableAutoPause = true;
	window.addEventListener(
		"screenswitch",
		(_event) => {
			let event = _event as ScreenSwitchEvent;
			if (is_dev) {
				log("Swapping to screen ", SCREEN_MAP[event.screen_type]);
			}
			game.set_screen(event.screen_type, event.data);
		},
		{},
	);
}
