import {
	Container,
	Graphics,
	Ticker,
	type ContainerOptions,
	type GraphicsOptions,
} from "pixi.js";
import log from "../log";
import type { Sound } from "@pixi/sound";
import type { ChartData, Note } from "../chart";
import { Signal } from "typed-signals";
import {
	CENTRE_LANE_SIDE_OFFSET,
	HIT_WINDOW,
	LANE_PADDING,
	LANE_SIZE,
} from "../data/constants";
import type { Keybind } from "../systems/keys";

export interface StrumlineOptions {
	options?: ContainerOptions;
}

// beat, pos, lane
export class RenderedNote extends Graphics {
	constructor(
		public beat: number,
		public lane: number,
		options?: GraphicsOptions,
	) {
		super(options);

		this.roundRect(-LANE_SIZE, -10, LANE_SIZE, 20, 4).fill("pink");
	}
}

export enum StrumlineState {
	NotPlaying,
	RequestStart,
	PreNotes,
	Playing,
	PostSong,
}

export class Strumline extends Container {
	private bg: Graphics;
	private bg_center: Graphics;
	private line: Graphics;

	public Ended: Signal<() => void>;

	private sound?: Sound;
	private chart?: ChartData;
	private bpm: number;

	private state: StrumlineState = StrumlineState.NotPlaying;
	private started_ms: DOMHighResTimeStamp = performance.now();
	private started_song_ms: DOMHighResTimeStamp = performance.now();
	private notes: Container = new Container({ zIndex: 30 });
	private remainingNotes: Note[] = [];

	private health: number = 80;

	private inputDownQueue: Keybind[] = [];

	constructor(
		private ticker: Ticker,
		options?: StrumlineOptions,
	) {
		super(options?.options);
		this.Ended = new Signal();
		this.Ended.connect(() => {
			this.state = StrumlineState.PostSong;
		});
		this.bpm = 0;
		this.bg = new Graphics({ alpha: 0.5 })
			.rect(
				-(CENTRE_LANE_SIDE_OFFSET + LANE_SIZE + LANE_PADDING * 2),
				-5000,
				LANE_SIZE,
				5000,
			)
			.rect(-(CENTRE_LANE_SIDE_OFFSET + LANE_PADDING), -5000, LANE_SIZE, 5000)
			.rect(CENTRE_LANE_SIDE_OFFSET + LANE_PADDING, -5000, 70, 5000)
			.rect(
				CENTRE_LANE_SIDE_OFFSET + LANE_SIZE + LANE_PADDING * 2,
				-5000,
				LANE_SIZE,
				5000,
			)
			.fill("black");
		this.addChild(this.bg);

		this.bg_center = new Graphics({ alpha: 0.1 });
		this.addChild(this.bg_center);
		this.line = new Graphics()
			.rect(
				-(CENTRE_LANE_SIDE_OFFSET + LANE_SIZE + LANE_PADDING * 2),
				-100,
				// ???????
				// POSTJAM: Fix this fuckery
				CENTRE_LANE_SIDE_OFFSET + LANE_SIZE * 4 + 3,
				2,
			)
			.fill("white");
		this.addChild(this.line);
		this.addChild(this.notes);
	}
	ready(color: string, sound: Sound, chart: ChartData, bpm: number) {
		this.bg_center.clear().rect(12, -5000, 46, 5000).fill(color);
		this.sound = sound;
		this.chart = chart;
		this.bpm = bpm;
	}

	async play() {
		log("will start playing");
		if (!this.chart) {
			throw new Error("No chart");
		}
		if (!this.sound) {
			throw new Error("No sound");
		}

		let notes = this.chart.notes.toSorted((a, b) => a.b - b.b);
		this.state = StrumlineState.RequestStart;
		this.remainingNotes = notes;
	}
	updateNotes() {
		let beats_from_start: number;
		if (this.state == StrumlineState.PreNotes) {
			beats_from_start = this.get_beats_from_start(
				this.started_ms + this.eight_beats_time(),
				performance.now(),
			);
		} else {
			beats_from_start = this.get_beats_from_start(
				this.started_song_ms,
				performance.now(),
			);
		}
		// log(this.notes);
		let i = 0;
		for (let note of this.notes.children as RenderedNote[]) {
			if (note === undefined) continue;
			// log("note:", note);
			if (this.state == StrumlineState.Playing) {
				// log("note.beat", note.beat, "beats_from_start", beats_from_start);
				// log(
				// 	"note.beat < beats_from_start",
				// 	note.beat < beats_from_start,
				// 	"(beats_from_start - note.beat) * this.ms_per_beat() >= HIT_WINDOW",
				// 	(beats_from_start - note.beat) * this.ms_per_beat() >= HIT_WINDOW,
				// );
				// // debugger;
				if (
					note.beat < beats_from_start &&
					(beats_from_start - note.beat) * this.ms_per_beat() >= HIT_WINDOW
				) {
					// this.notes.removeChild(note);
					this.missNote(note);
				}
			}

			i++;
		}
		while (true) {
			let note = this.remainingNotes[0];
			if (note == undefined) break;
			// log("remainingNote note:", note);
			// log(note.b - beats_from_start);
			if (beats_from_start - note.b < 32) {
				this.notes.addChild(new RenderedNote(note.b, note.l));
				this.remainingNotes.shift();
			} else {
				break;
			}
		}
	}
	//TODO:
	missNote(note: RenderedNote) {
		// log("Note missed");
	}
	renderNotes() {
		for (let note of this.notes.children as RenderedNote[]) {
			if (note === undefined) continue;
			let x: number;
			switch (note.lane) {
				case 0:
					x = -(CENTRE_LANE_SIDE_OFFSET + LANE_SIZE + LANE_PADDING * 2);
					break;
				case 1:
					x = -(CENTRE_LANE_SIDE_OFFSET + LANE_PADDING);
					break;
				case 2:
					x = CENTRE_LANE_SIDE_OFFSET + LANE_PADDING;
					break;
				case 3:
					x = CENTRE_LANE_SIDE_OFFSET + LANE_SIZE + LANE_PADDING * 2;
					break;
				default:
					throw new Error("Lane is not valid");
			}
			note.x = x;
			note.y = -Date.now() % 1000;
			// log(note);
		}
	}
	ms_per_beat() {
		return (60 * 1000) / this.bpm;
	}
	get_beats_from_start(start_ms: number, time: number) {
		let ms_per_beat = (60 * 1000) / this.bpm;
		// log(
		// 	"start_ms: ",
		// 	start_ms,
		// 	"time: ",
		// 	time,
		// 	"ms_per_beat: ",
		// 	ms_per_beat,
		// 	"calc:",
		// 	(time - start_ms) / ms_per_beat,
		// );
		return (time - start_ms) / ms_per_beat;
	}
	eight_beats_time() {
		return ((60 * 1000) / this.bpm) * 8;
	}
	update(time: Ticker) {
		// log("Strumline update");
		if (this.state == StrumlineState.RequestStart) {
			this.started_ms = performance.now();
			this.state = StrumlineState.PreNotes;
		} else if (this.state == StrumlineState.PreNotes) {
			let now = performance.now();
			if (now > this.started_ms + this.eight_beats_time()) {
				this.sound!.play({ complete: this.Ended.emit.bind(this.Ended) });
				this.started_song_ms = performance.now();
				this.state = StrumlineState.Playing;
			}
			this.updateNotes();
			this.renderNotes();
		} else if (this.state == StrumlineState.Playing) {
			this.updateNotes();
			this.renderNotes();
		} else if (this.state == StrumlineState.PostSong) {
			this.updateNotes();
			this.renderNotes();
		}
	}
}
