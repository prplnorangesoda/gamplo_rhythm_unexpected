export default class Keys {
    keys: Map<string, boolean>;
    onclickl = this.onclick.bind(this);
    onkeydownl = this.onKeyDown.bind(this);
    onkeyupl = this.onKeyUp.bind(this);
    constructor() {
        this.keys = new Map();
        window.addEventListener("click", this.onclickl)
        window.addEventListener("keydown", this.onkeydownl)
        window.addEventListener("keyup", this.onkeyupl);
    }
    destroy() {
        window.removeEventListener("click", this.onclickl)
        window.removeEventListener("keydown", this.onkeydownl)
        window.removeEventListener("keyup", this.onkeyupl);
    }
    onclick(event: PointerEvent) {
        console.log(event)
    }
    onKeyDown(event: KeyboardEvent) {
        this.keys.set(event.code, true)
        console.log("keyDown", event)
    }
    onKeyUp(event: KeyboardEvent) {
        this.keys.set(event.code, false)
        console.log("keyUp", event)
    }
}