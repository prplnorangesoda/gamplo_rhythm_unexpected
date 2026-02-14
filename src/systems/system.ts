import { NavSystem } from "./nav";

export type Systems = {
	nav: NavSystem;
};

export function createSystems(): Systems {
	return {
		nav: new NavSystem(),
	};
}
