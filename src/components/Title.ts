import { Container, Text } from "pixi.js";
import { Colors } from "../colors";

export default class Title extends Container {
	titleText: Text;
	constructor() {
		super();
		this.titleText = new Text({
			text: "Title",
			style: { fontFamily: "Roboto", fontSize: "80", fill: Colors.TEXT },
		});
		this.titleText.anchor = 0.5;
		this.addChild(this.titleText);
	}
}
