import KeySystem from "./keys";
import { NavSystem } from "./nav";

export type Systems = {
	nav: NavSystem;
	keys: KeySystem;
};

export function createSystems(): Systems {
	return {
		nav: new NavSystem(),
		keys: new KeySystem(),
	};
}
