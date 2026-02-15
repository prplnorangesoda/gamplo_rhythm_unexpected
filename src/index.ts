import { Application, type Renderer } from "pixi.js";
import { AudioUrls } from "./audio";
import { is_dev } from "./env";
import GameManager, { SCREEN_MAP } from "./game";
import { setup_sync } from "./gamplo_sync";
import log from "./log";
import { Colors } from "./colors";
import { ScreenKind } from "./screens/screen";
import { createSystems } from "./systems/system";
import type { ScreenSwitchEvent } from "./systems/nav";

// console.log("Hello via Bun!");
setup_sync();

log("Running under development:", is_dev);
main();

async function sleep(millis: number) {
	await new Promise((resolve, reject) => {
		setTimeout(resolve, millis);
	});
}

async function main() {
	log("running main");
	// debugger;

	const app = new Application();
	const systems = createSystems();

	const pin = document.getElementById("pin")!;
	await app.init({ background: Colors.BG, resizeTo: pin });
	document.body.appendChild(app.canvas);

	const game = new GameManager(app, systems);

	app.renderer.hello;
	game.init();

	log(SCREEN_MAP);
	game.set_screen(ScreenKind.MainMenu);
	window.addEventListener(
		"screenswitch",
		(_event) => {
			let event = _event as ScreenSwitchEvent;
			if (is_dev) {
				log("Swapping to screen ", SCREEN_MAP[event.screen_type]);
			}
			game.set_screen(event.screen_type);
		},
		{},
	);
}
