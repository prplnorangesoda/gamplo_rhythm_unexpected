import { Container, FederatedPointerEvent, Text } from "pixi.js";
import { ScreenKind, type AppScreen } from "./screen";
import Title from "../components/Title";
import gsap from "gsap";
import { MenuButton } from "../components/MenuButton";
import type { Systems } from "../systems/system";
import type { Button } from "@pixi/ui";
import log from "../log";
import { SONGS } from "../data/songs";

export class InSongScreen extends Container implements AppScreen {
	public static NAME = "insong";
	public static LAYER = "main";

	private size = {
		w: 0,
		h: 0,
	};
	private title: Title;
	private title_anim?: gsap.core.Tween;

	private buttons!: Container;
	private play_button!: MenuButton;

	constructor(private systems: Systems) {
		super();

		this.title = new Title();
		this.addChild(this.title);

		this.makeButtons();
	}

	onPlayButtonClicked(button?: Button, event?: FederatedPointerEvent) {
		log("Pressed");
		this.systems.nav.requestScreenSwitch(ScreenKind.InSong, {
			song: SONGS["crafter2011"],
		});
	}

	makeButtons() {
		this.buttons = new Container();
		this.play_button = new MenuButton({
			text: "Play",
			w: 600,
			h: 100,
		});
		this.buttons.addChild(this.play_button);
		this.play_button.onPress.connect(this.onPlayButtonClicked.bind(this));
		this.addChild(this.buttons);
	}

	async onShow() {
		this.title.y = -1000;
		this.title_anim = gsap.to(this.title, {
			y: this.size.h * 0.1,
			duration: 2,
			ease: "sine.Out",
		});

		await this.title_anim;
		delete this.title_anim;

		let promises = [gsap.to];
	}

	onResize(w: number, h: number) {
		this.size.w = w;
		this.size.h = h;

		this.title.x = w / 2;
		if (this.title_anim) {
			this.title_anim.resetTo("y", this.size.h * 0.1);
		} else {
			this.title.y = h * 0.1;
		}

		this.play_button.x = w / 2;
		this.play_button.y = h - 10;
	}

	async onHide() {}
}
