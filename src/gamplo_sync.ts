
export function setup_sync() {
    function gamplo_ready() {
        console.log("Running under gamplo, doing sync")
    }

    Gamplo.onReady(gamplo_ready)

    if (Gamplo.isReady()) {
        gamplo_ready()
    }
}