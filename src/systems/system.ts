import KeySystem from "./keys";
import { NavSystem } from "./nav";
import TickerSystem from "./ticker";
// import { is_dev } from "../env";
import type { Application } from "pixi.js";

export type Systems = {
	nav: NavSystem;
	keys: KeySystem;
	ticker: TickerSystem;
};

export function createSystems(app: Application): Systems {
	return {
		nav: new NavSystem(),
		keys: new KeySystem(),
		ticker: new TickerSystem(app),
	};
}
