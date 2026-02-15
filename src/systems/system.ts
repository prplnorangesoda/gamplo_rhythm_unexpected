import type { Ticker } from "pixi.js";
import KeySystem from "./keys";
import { NavSystem } from "./nav";

export type Systems = {
	nav: NavSystem;
	keys: KeySystem;
	ticker: Ticker;
};

export function createSystems(ticker: Ticker): Systems {
	return {
		nav: new NavSystem(),
		keys: new KeySystem(),
		ticker,
	};
}
