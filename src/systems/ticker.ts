import type { Application } from "pixi.js";
import log from "../log";
import gsap from "gsap";
import { MIN_MS_PER_FRAME } from "../data/constants";
import { Signal, type SignalConnection } from "typed-signals";
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
export interface TimerInfo {
	deltaTime: number;
	deltaMS: number;
}
export default class TickerSystem {
	private stopped: boolean = true;
	private last_frame_moment_ms: DOMHighResTimeStamp;
	private signal: Signal<(timer: TimerInfo) => void> = new Signal();
	private interval: number | undefined;
	// static BROWSER = sniff_browser();
	public constructor(
		private app: Application,
		public vsync = true,
		public use_postpone = false,
	) {
		log("vsync:", vsync);
		this.last_frame_moment_ms = performance.now();
	}
	async loop() {
		// log("Looping");
		if (this.stopped) {
			clearInterval(this.interval);
			return;
		}
		let now = performance.now();
		if (now <= this.last_frame_moment_ms + MIN_MS_PER_FRAME) {
			// log("Postponing to next ms");
			await this.yield_to_browser();
			return;
		}

		let deltaMS = now - this.last_frame_moment_ms;
		if (deltaMS == 0) {
			log("Something has gone evilly wrong.");
			log(
				"now >= this.last_frame_moment_ms + MIN_MS_PER_FRAME",
				now,
				">=",
				this.last_frame_moment_ms + MIN_MS_PER_FRAME,
			);
			log(
				"now = ",
				now,
				"this.last_frame_moment_ms = ",
				this.last_frame_moment_ms,
			);
			log("deltaMS = ", deltaMS);
		}

		let deltaTime = deltaMS / 1000;
		gsap.ticker.tick();
		this.signal.emit({ deltaMS, deltaTime });
		this.app.render();
		// log(performance.now() - this.last_frame_moment_ms);
		this.last_frame_moment_ms = performance.now();
		await this.yield_to_browser();
	}
	yield_to_browser(): Promise<void> {
		if (this.vsync) {
			let prom: Promise<void> = new Promise((res) =>
				requestAnimationFrame(() => {
					// log("RequestAnimationFrame called");
					res();
				}),
			);
			// log("Yielding with vsync callback: ", prom);
			return prom;
		} else if (this.use_postpone) {
			return new Promise((res) => postpone(res));
		} else {
			let prom: Promise<void> = new Promise((res) => setTimeout(res));
			// log("Yielding with non-vsync callback: ", prom);
			return prom;
		}
	}
	start() {
		this.stopped = false;
		this.interval = setInterval(this.loop.bind(this), 0) as unknown as number;
	}
	stop() {
		this.stopped = true;
	}
	add(
		func: (timer: TimerInfo) => void,
		options?: ConnectOptions,
	): SignalConnection {
		return this.signal.connect(func, options);
	}
	remove(func: (timer: TimerInfo) => void) {
		return this.signal.disconnect(func);
	}
}
