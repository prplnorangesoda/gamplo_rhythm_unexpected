import type { Container, Ticker } from "pixi.js";

export interface AppScreen<Data = any> extends Container {
	onShow: (data: Data) => Promise<void>;
	onHide: () => Promise<void>;
	onUpdate?: (time: Ticker) => void;
	onResize?: (w: number, h: number) => void;
}

export interface ScreenConstructor {
	readonly NAME: string;
	readonly LAYER: string;
	new (): AppScreen;
}

export enum ScreenKind {
	MainMenu,
	InSong,
}
