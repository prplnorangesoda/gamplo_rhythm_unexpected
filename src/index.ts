import { Application, type Renderer } from "pixi.js";
import { AudioUrls } from "./audio";
import { is_dev } from "./env";
import GameManager from "./game";
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

	game.init();

	game.set_screen(ScreenKind.MainMenu);
	window.addEventListener("screenswitch", (event: ScreenSwitchEvent) => {}, {});
}
