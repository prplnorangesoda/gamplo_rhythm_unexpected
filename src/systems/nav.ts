import type { ScreenKind } from "../screens/screen";

export class ScreenSwitchEvent extends Event {
	constructor(
		type: string,
		public screen_type: ScreenKind,
		public data: any,
		eventInitDict?: EventInit,
	) {
		super(type, eventInitDict);
	}
}

export class NavSystem {
	constructor() {}

	requestScreenSwitch(to_screen: ScreenKind, data: any) {
		let screenChangeRequest = new ScreenSwitchEvent(
			"screenswitch",
			to_screen,
			data,
		);
		window.dispatchEvent(screenChangeRequest);
	}
}
