import { Application, Text } from "pixi.js";
import { is_dev } from "./env";
import GameManager, { SCREEN_MAP } from "./game";
import { setup_sync } from "./gamplo_sync";
import log from "./log";
import { Colors } from "./colors";
import { createSystems } from "./systems/system";
import type { ScreenSwitchEvent } from "./systems/nav";
import { sound } from "@pixi/sound";

// console.log("Hello via Bun!");
setup_sync();

log("Running under development:", is_dev);
main();

async function main() {
	log("running main");
	// debugger;

	const app = new Application();
	const systems = createSystems(app.ticker);

	const pin = document.getElementById("pin")!;
	await app.init({ background: Colors.BG, resizeTo: pin });
	document.body.appendChild(app.canvas);

	const game = new GameManager(app, systems);

	let fps = new Text({ text: "FPS", style: { fill: "lime", fontSize: 12 } });
	app.stage.addChild(fps);
	app.ticker.add(
		(ticker) => (fps.text = "FPS: " + Math.round(ticker.FPS * 100) / 100),
	);
	game.init();

	sound.disableAutoPause = true;
	// log(SCREEN_MAP);
	// game.set_screen(ScreenKind.MainMenu);
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
