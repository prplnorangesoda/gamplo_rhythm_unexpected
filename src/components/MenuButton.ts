import { FancyButton, type ButtonOptions } from "@pixi/ui";
import { Container, Graphics, Text, type TextStyle } from "pixi.js";
import { Colors } from "../colors";

export interface MenuButtonOptions {
	text?: string;
	w: number;
	h: number;
	textStyle?: TextStyle;
	buttonOptions?: ButtonOptions;
}
export class MenuButton extends FancyButton {
	constructor(options: MenuButtonOptions) {
		const text = new Text({
			text: options.text ?? "button",
			style: {
				fill: Colors.TEXT,
				fontFamily: "sans-serif",
				fontWeight: "bold",
				align: "center",
				fontSize: 60,
				...options.textStyle,
			},
		});
		super({
			// // Assign the default view
			// defaultView: "play-btn-up",
			defaultView: new Graphics()
				.rect(0, 0, options.w, options.h)
				.fill("black"),
			// // Assign the pressed view
			// pressedView: "play-btn-down",

			text,
			// Center-bottom because the menu is on the bottom half
			anchorX: 0.5,
			anchorY: 1.0,
			scale: 0.6,
			...options.buttonOptions,
		});
	}
}
