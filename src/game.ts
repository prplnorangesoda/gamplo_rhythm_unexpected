import { AudioUrls } from "./audio";
import Keys from "./keys";
import { Songs } from "./data/songs";
import type { Application, Renderer } from "pixi.js";

enum GameStateType {
    MainMenu,
    InSong
}
enum MainMenuArea {
    Main,
    SongSelect
}

type MainMenuState = {
    type: GameStateType.MainMenu,
    data: {
        area: MainMenuArea
    }
}
type InSongState = {
    type: GameStateType.InSong
    data: {
        song: keyof typeof Songs
    }
}
type GameState =
    | MainMenuState

export default class Game {
    keys: Keys;
    music: HTMLAudioElement;
    state: GameState;

    constructor(private app: Application<Renderer>) {
        this.keys = new Keys();
        this.music = new Audio();
        this.music.volume = 0.2
        this.state = {
            type: GameStateType.MainMenu, data: {
                area: MainMenuArea.Main
            }
        }
    }

    init() {
        this.music.src = AudioUrls.MUS_MENU_BEGIN;
        this.music.play();
    }
    destroy() {
        this.music.pause()
        this.keys.destroy()
    }
}