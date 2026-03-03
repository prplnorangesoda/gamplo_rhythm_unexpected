import type { Application } from "pixi.js";
import log from "../log";
import gsap from "gsap";
import { MIN_MS_PER_FRAME } from "../data/constants";
import { Signal } from "typed-signals";
import type { ConnectOptions } from "typed-signals/dist/Signal";

let postpone = (function () {
	let fnMap = new Map(),
		idMap = new Map(),
		fnId = 0;
	let msg = { fnId: 0 };
	function _postpone(fn: Function) {
		if (!fnMap.get(fn)) {
			fnId++;
			fnMap.set(fn, fnId);
			idMap.set(fnId, fn);
		}
		msg.fnId = fnMap.get(fn);
		postMessage(msg, "*");
	}
	function _postponeListener(e: MessageEvent) {
		let fnId = e.data.fnId;
		if (fnId) idMap.get(fnId)();
	}
	window.addEventListener("message", _postponeListener);
	return _postpone;
})();

// enum Browser {
// 	Chrome,
// 	Other,
// }

// function sniff_browser(): Browser {
// 	if (navigator.userAgent.includes("Chrome")) {
// 		return Browser.Chrome;
// 	}
// 	return Browser.Other;
// }
export interface TimerInfo {}
export default class TickerSystem {
	private stopped: boolean = true;
	private last_frame_moment_ms: DOMHighResTimeStamp;
	private loop_closure;
	private signal = new Signal();
	// static BROWSER = sniff_browser();
	public constructor(
		private app: Application,
		public vsync = true,
	) {
		log("vsync:", vsync);
		this.last_frame_moment_ms = performance.now();
		this.loop_closure = this.loop.bind(this);
	}
	loop() {
		// log("Looping");
		if (this.stopped) {
			return;
		}
		if (!this.vsync) {
			if (performance.now() <= this.last_frame_moment_ms + MIN_MS_PER_FRAME) {
				// log("Postponing to next ms");
				postpone(this.loop_closure);
				return;
			}
		}

		gsap.ticker.tick();
		this.signal.emit({});
		this.app.render();
		// log(performance.now() - this.last_frame_moment_ms);
		this.last_frame_moment_ms = performance.now();
		if (!this.stopped) {
			if (this.vsync) {
				requestAnimationFrame(this.loop_closure);
			} else {
				postpone(this.loop_closure);
			}
		}
	}
	start() {
		this.stopped = false;
		this.loop();
	}
	stop() {
		this.stopped = true;
	}
	add(func: (timer: TimerInfo) => void, options?: ConnectOptions) {
		return this.signal.connect(func, options);
	}
	remove(func: (timer: TimerInfo) => void) {
		return this.signal.disconnect(func);
	}
}
