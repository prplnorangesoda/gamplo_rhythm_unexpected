import { Container, Graphics, type ContainerOptions } from "pixi.js";
import log from "../log";

export interface StrumlineOptions {
	options?: ContainerOptions;
}
export class Strumline extends Container {
	private bg: Graphics;
	private bg_center: Graphics;
	private line: Graphics;
	private LANE_SIZE = 70;
	private LANE_PADDING = 3;

	private CENTRE_LANE_SIZE = 120;
	private CENTRE_LANE_SIDE_OFFSET = this.CENTRE_LANE_SIZE / 2;

	constructor(options?: StrumlineOptions) {
		super(options?.options);
		this.bg = new Graphics({ alpha: 0.5 })
			.rect(
				-(
					this.CENTRE_LANE_SIDE_OFFSET +
					this.LANE_SIZE +
					this.LANE_PADDING * 2
				),
				-5000,
				this.LANE_SIZE,
				5000,
			)
			.rect(
				-(this.CENTRE_LANE_SIDE_OFFSET + this.LANE_PADDING),
				-5000,
				this.LANE_SIZE,
				5000,
			)
			.rect(this.CENTRE_LANE_SIDE_OFFSET + this.LANE_PADDING, -5000, 70, 5000)
			.rect(
				this.CENTRE_LANE_SIDE_OFFSET + this.LANE_SIZE + this.LANE_PADDING * 2,
				-5000,
				this.LANE_SIZE,
				5000,
			)
			.fill("black");
		this.addChild(this.bg);

		this.bg_center = new Graphics({ alpha: 0.1 });
		this.addChild(this.bg_center);
		this.line = new Graphics()
			.rect(
				-(
					this.CENTRE_LANE_SIDE_OFFSET +
					this.LANE_SIZE +
					this.LANE_PADDING * 2
				),
				-100,
				// ???????
				// POSTJAM: Fix this fuckery
				this.CENTRE_LANE_SIDE_OFFSET + this.LANE_SIZE * 4 + 2,
				2,
			)
			.fill("white");
		this.addChild(this.line);
	}
	ready(color: string) {
		this.bg_center.clear().rect(12, -5000, 46, 5000).fill(color);
	}
}
