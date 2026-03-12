import { GAMPLO_ENABLED } from "./data/constants";

export async function setup_sync() {
	if (!GAMPLO_ENABLED) {
		return;
	}

	function gamplo_ready() {
		console.log("Running under gamplo, doing sync");
	}
	//@ts-expect-error
	let Gamplo: Gamplo = await import("https://gamplo.com/sdk/gamplo.js");
	Gamplo.onReady(gamplo_ready);

	if (Gamplo.isReady()) {
		gamplo_ready();
	}
}
