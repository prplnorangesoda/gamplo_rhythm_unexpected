import type { ScreenKind } from "../screens/screen";

export class ScreenSwitchEvent extends Event {
	constructor(
		type: string,
		screen_type: ScreenKind,
		eventInitDict?: EventInit,
	) {
		super(type, eventInitDict);
	}
}

export class NavSystem {
	constructor() {}

	requestScreenSwitch(to_screen: ScreenKind) {
		let screenChangeRequest = new ScreenSwitchEvent("pageswitch", to_screen);
		window.dispatchEvent(screenChangeRequest);
	}
}
