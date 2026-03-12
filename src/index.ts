import { Application, Text, TickerPlugin, extensions } from "pixi.js";
import GameManager, { SCREEN_MAP } from "./game";
import { setup_sync } from "./gamplo_sync";
import log from "./log";
import { Colors } from "./colors";
import { createSystems } from "./systems/system";
import type { ScreenSwitchEvent } from "./systems/nav";
import { sound } from "@pixi/sound";
import { sleep } from "./sleep";
import gsap from "gsap";
import { IS_DEV } from "./data/constants";

// console.log("Hello via Bun!");
setup_sync();

log("Running under development:", IS_DEV);
main();

let fps: Text | undefined;
async function main() {
	log("running main");

	const app = new Application();
	const systems = createSystems(app);

	Object.defineProperty(window, "systems", {
		value: systems,
		configurable: true,
	});
	const pin = document.getElementById("pin")!;

	gsap.ticker.fps(1);
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
	let time = performance.now();
	let elapsed_ms_collector: number[] = [];
	systems.ticker.add(function (timer) {
		elapsed_ms_collector.push(1000 / timer.deltaMS);
		// log(timer.deltaMS);
		// log(elapsed_ms_collector);
		if (performance.now() - time > 1000) {
			time = performance.now();
			let total_num = elapsed_ms_collector.reduce(
				(prev, current, _idx, _arr) => {
					return prev + current;
				},
			);
			let length = elapsed_ms_collector.length;
			let avg_fps = total_num / length;
			fps_text.text = avg_fps.toFixed(1) + " FPS";
			elapsed_ms_collector = [];
		}
	});
	game.init();
	sound.disableAutoPause = true;
	window.addEventListener(
		"screenswitch",
		(_event) => {
			let event = _event as ScreenSwitchEvent;
			if (IS_DEV) {
				log("Swapping to screen ", SCREEN_MAP[event.screen_type]);
			}
			game.set_screen(event.screen_type, event.data);
		},
		{},
	);
}
