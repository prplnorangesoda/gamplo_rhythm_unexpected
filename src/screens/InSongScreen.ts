import { Container, FederatedPointerEvent, Text, Ticker } from "pixi.js";
import { ScreenKind, type AppScreen } from "./screen";
import gsap from "gsap";
import type { Systems } from "../systems/system";
import type { Button } from "@pixi/ui";
import { type SongData } from "../data/songs";
import log from "../log";
import { Colors } from "../colors";
import { sleep } from "../sleep";
import { Strumline } from "../components/Strumline";
import { Sound } from "@pixi/sound";
import { get_chart_from_url } from "../chart";

export interface InSongScreenData {
	song: SongData;
}
export class InSongScreen
	extends Container
	implements AppScreen<InSongScreenData>
{
	public static NAME = "insong";
	public static LAYER = "main";

	private size = {
		w: 0,
		h: 0,
	};

	private song_title_text: Text;
	private song_author_text: Text;

	private loading_text: Text;
	private inSongContainer: Container;
	private loadingSongContainer: Container;

	private strumline: Strumline;
	private playing: boolean;

	// private sound?: Sound;
	constructor(private systems: Systems) {
		super();

		this.playing = false;
		this.loadingSongContainer = new Container();

		this.loading_text = new Text({
			text: "LOADING",
			style: {
				fill: Colors.TEXT,
				fontSize: 60,
				fontFamily: "Roboto",
				align: "center",
			},
			anchor: 0.5,
		});
		this.loadingSongContainer.addChild(this.loading_text);
		// Construct details only shown in song
		this.inSongContainer = new Container({ alpha: 0 });

		this.strumline = new Strumline(systems.ticker);
		this.inSongContainer.addChild(this.strumline);
		this.song_title_text = new Text({
			text: "TITLE",
			style: {
				stroke: {
					color: "purple",
					width: 4,
				},
				fill: Colors.TEXT,
				fontSize: 24,
				fontFamily: "Roboto",
				align: "left",
			},
		});
		this.song_title_text.anchor = { x: 0, y: 1 };
		this.inSongContainer.addChild(this.song_title_text);
		this.song_author_text = new Text({
			text: "AUTHOR",

			style: {
				stroke: {
					color: "black",
					width: 4,
				},
				fill: Colors.TEXT,
				fontSize: 24,
				fontFamily: "Roboto",
				align: "left",
			},
		});
		this.song_title_text.anchor = { x: 0, y: 1 };
		this.inSongContainer.addChild(this.song_author_text);
	}

	async onShow(data: InSongScreenData) {
		this.addChild(this.loadingSongContainer);
		log("showing with data:", data);
		this.song_title_text.text = data.song.name;
		this.song_author_text.text = data.song.artist;
		this.song_title_text.style.stroke = data.song.color;

		let promises = await Promise.all([
			(async () => {
				let sound: Sound = await new Promise((res, rej) => {
					let sound = Sound.from({
						url: data.song.audio,
						autoPlay: false,
						preload: true,

						loaded: () => {
							log("sound loaded:", data.song.audio);
							res(sound);
						},
					});
				});
				return sound;
			})(),
			get_chart_from_url(data.song.charts.easy!),
		]);

		let sound = promises[0];
		let chart = promises[1];
		this.addChild(this.inSongContainer);
		this.strumline.ready(data.song.color, sound, chart, data.song.bpm);
		// Load
		// await sleep(1000);
		await Promise.all([
			gsap.to(this.inSongContainer, { alpha: 1, duration: 1.0 }),
			gsap.to(this.loadingSongContainer, { alpha: 0, duration: 1.0 }),
		]);
		this.removeChild(this.loadingSongContainer);
		// log("this.playing = true");
		this.playing = true;
		this.strumline.play();
		await new Promise<void>((res, rej) => {
			let connection = this.strumline.Ended.connect(() => {
				log("Song ended");
				connection.disconnect();
				res();
			});
		});
	}

	onUpdate(time: Ticker) {
		// log("this.playing", this.playing);
		if (this.playing) {
			this.strumline.update(time);
		}
	}

	onResize(w: number, h: number) {
		this.size.w = w;
		this.size.h = h;

		this.loading_text.x = w / 2;
		this.loading_text.y = h / 2;

		this.song_title_text.y = h;
		this.song_title_text.x = 8;
		this.song_title_text.zIndex = 50;

		this.song_author_text.y = h - 60;
		this.song_author_text.x = 8;
		this.song_author_text.zIndex = 49;

		this.strumline.x = w / 2;
		this.strumline.y = h;
	}

	async onHide() {
		this.removeChild(this.inSongContainer);
		this.playing = false;
	}
}
