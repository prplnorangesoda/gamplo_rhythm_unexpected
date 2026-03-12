import type { Container } from "pixi.js";
import type { TimerInfo } from "../systems/ticker";

export interface AppScreen<Data = any> extends Container {
	onShow: (data: Data) => Promise<void>;
	onHide: () => Promise<void>;
	onUpdate?: (time: TimerInfo) => void;
	onResize?: (w: number, h: number) => void;
}

export interface ScreenConstructor {
	readonly SCREEN_NAME: string;
	readonly LAYER: string;
	new (): AppScreen;
}

export enum ScreenKind {
	MainMenu,
	InSong,
}
