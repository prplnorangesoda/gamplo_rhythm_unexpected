import { Signal } from "typed-signals";
// import log from "../log";

export enum Keybind {
	D,
	F,
	J,
	K,
	Space,
	Enter,
	Escape,
}
export default class KeySystem {
	keys: Map<string, boolean>;
	// private onclickl = this.onclick.bind(this);
	private onkeydownl = this.onKeyDown.bind(this);
	private onkeyupl = this.onKeyUp.bind(this);

	// To remap these later potentially
	public static binds: { [index: string]: Keybind } = {
		KeyD: Keybind.D,
		KeyF: Keybind.F,
		KeyJ: Keybind.J,
		KeyK: Keybind.K,
		Space: Keybind.Space,
		Enter: Keybind.Enter,
		Escape: Keybind.Escape,
	};

	public readonly bindDown: Signal<(bind: Keybind) => void>;

	constructor() {
		this.keys = new Map();
		this.bindDown = new Signal();
		// window.addEventListener("click", this.onclickl);
		window.addEventListener("keydown", this.onkeydownl);
		window.addEventListener("keyup", this.onkeyupl);
	}
	destroy() {
		// window.removeEventListener("click", this.onclickl);
		window.removeEventListener("keydown", this.onkeydownl);
		window.removeEventListener("keyup", this.onkeyupl);
	}
	// private onclick(event: PointerEvent) {
	// 	event.preventDefault();
	// 	console.log(event);
	// }
	private onKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		this.keys.set(event.code, true);
		let bind = KeySystem.binds[event.code];
		if (bind !== undefined) {
			// log("Event code in KeySystem.binds");
			this.bindDown.emit(bind);
		}
		console.log("keyDown", event.code);
	}
	private onKeyUp(event: KeyboardEvent) {
		event.preventDefault();
		this.keys.set(event.code, false);
		// console.log("keyUp", event);
	}
}
