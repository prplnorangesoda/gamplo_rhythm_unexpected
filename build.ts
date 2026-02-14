import { $ } from "bun"

await $`bun tailwindcss -i ./index.css -o ./dist.css`
await $`rm -r dist/*`
await Bun.build({
    entrypoints: ["./index.html"],
    outdir: "./dist",
    minify: true
})