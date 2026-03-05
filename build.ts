import { $ } from "bun";
import fs from "node:fs";
await $`bun tailwindcss -i ./index.css -o ./dist.css`;

await $`mkdir -p dist`;
if (fs.existsSync("dist") && fs.existsSync("dist/index.html"))
	await $`rm -r dist/*`;
await Bun.build({
	entrypoints: ["./index.html"],
	outdir: "./dist",
	minify: true,
	footer: "(c) Lucy Faria 2026. Built on " + new Date().toISOString(),
	define: {
		["process.env.NODE_ENV"]: '"production"',
		["process.env.GAMPLO_ENABLED"]: "true",
	},
});
