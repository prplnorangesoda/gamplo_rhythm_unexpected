import KeySystem from "./systems/keys";
import { Container, type Application, type Renderer } from "pixi.js";
import { MainMenuScreen } from "./screens/MainMenuScreen";
import { ScreenKind as ScreenKind, type AppScreen } from "./screens/screen";
import type { Systems } from "./systems/system";
import { InSongScreen } from "./screens/InSongScreen";
import log from "./log";

export const SCREEN_MAP = {
	[ScreenKind.MainMenu]: MainMenuScreen,
	[ScreenKind.InSong]: InSongScreen,
};
export default class GameManager {
	// keys: KeySystem;
	// music: HTMLAudioElement;
	current_screen?: AppScreen;
	// Contains what is actually rendered to the screen
	screen_container: Container;
	current_overlays: AppScreen[];
	// Contains what is actually rendered to the screen
	overlay_container: Container;
	screens: Map<ScreenKind, AppScreen>;

	constructor(
		private app: Application<Renderer>,
		private systems: Systems,
	) {
		// this.keys = new KeySystem();
		// this.music = new Audio();
		// this.music.volume = 0.2;
		this.screen_container = new Container();
		app.stage.addChild(this.screen_container);
		this.overlay_container = new Container();
		app.stage.addChild(this.overlay_container);
		this.current_overlays = [];
		this.screens = new Map();
		this.set_screen(ScreenKind.MainMenu);
	}

	async set_screen<T extends ScreenKind>(
		screen_kind: ScreenKind,
		data?: (typeof SCREEN_MAP)[T],
	) {
		log("Setting screen", screen_kind);
		if (this.current_screen) {
			log("Current screen:", SCREEN_MAP[screen_kind].name);
			await this.current_screen.onHide();
			if (this.current_screen.onUpdate) {
				this.app.ticker.remove(
					this.current_screen.onUpdate.bind(this.current_screen),
				);
			}
			if (this.current_screen.parent) {
				this.current_screen.parent.removeChild(this.current_screen);
			}
		}

		let screen_to_set = this.screens.get(screen_kind);
		if (screen_to_set === undefined) {
			screen_to_set = new SCREEN_MAP[screen_kind](this.systems);
			this.screens.set(screen_kind, screen_to_set);
		}

		if (screen_to_set.onResize) {
			screen_to_set.onResize(this.app.canvas.width, this.app.canvas.height);
		}
		if (screen_to_set.onUpdate) {
			this.app.ticker.add(screen_to_set.onUpdate.bind(screen_to_set));
		}

		this.current_screen = screen_to_set;
		this.screen_container.addChild(screen_to_set);
		// log(this.app.stage.children);
		await screen_to_set.onShow(data);
	}
	init() {
		// this.music.src = AudioUrls.MUS_MENU_BEGIN;
		// this.music.play();
	}
	destroy() {
		// this.music.pause()
		// this.keys.destroy()
	}
}
