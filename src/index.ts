import { Application, type Renderer } from "pixi.js";
import { AudioUrls } from "./audio";
import { is_dev } from "./env";
import Game from "./game";
import { setup_sync } from "./gamplo_sync";
import log from "./log";
import { Colors } from "./colors";

// console.log("Hello via Bun!");
setup_sync()

log("Running under development:", is_dev)

let hot_app: Application<Renderer>;
let hot_game: Game;

import.meta.hot.dispose(() => {
    try {
        hot_app.canvas.remove();
        hot_app.destroy();
        hot_game.destroy()
    } catch (err) { }
})

import.meta.hot.accept();

async function sleep(millis: number) {
    await new Promise((resolve, reject) => { setTimeout(resolve, millis) })
}

async function main() {
    const app = new Application();


    await app.init({ background: Colors.BG, resizeTo: window })
    document.body.appendChild(app.canvas)

    const game = new Game(app);

    if (import.meta.hot) {
        hot_app = app;
        hot_game = game;
    }

    game.init();
}

window.addEventListener("click", main, { once: true })
