import { AudioUrls } from "./audio";
import Keys from "./keys";
import { Songs } from "./data/songs";
import { Container, type Application, type Renderer } from "pixi.js";
import { MainMenuScreen } from "./screens/MainMenuScreen";
import { ScreenKind as ScreenKind, type AppScreen } from "./screens/screen";
import type { Systems } from "./systems/system";

export const SCREEN_MAP = {
	[ScreenKind.MainMenu]: MainMenuScreen,
	[ScreenKind.InSong]: MainMenuScreen,
};
export default class GameManager {
	keys: Keys;
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
		this.keys = new Keys();
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

	async set_screen(screen_kind: ScreenKind) {
		if (this.current_screen) {
			this.current_screen.onHide();
		}

		let screen_to_set = this.screens.get(screen_kind);
		if (screen_to_set === undefined) {
			screen_to_set = new SCREEN_MAP[screen_kind](this.systems);
		}

		if (screen_to_set.onResize) {
			screen_to_set.onResize(this.app.canvas.width, this.app.canvas.height);
		}
		this.screen_container.addChild(screen_to_set);
		await screen_to_set.onShow();
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
