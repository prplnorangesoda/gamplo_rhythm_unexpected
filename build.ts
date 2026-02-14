import { $ } from "bun";
import fs from "node:fs";
(async () => {
	await $`bun tailwindcss -i ./index.css -o ./dist.css`;

	await $`mkdir -p dist`;
	if (fs.existsSync("dist") && fs.existsSync("dist/index.html"))
		await $`rm -r dist/*`;
	await Bun.build({
		entrypoints: ["./index.html"],
		outdir: "./dist",
		minify: true,
		define: {
			["process.env.NODE_ENV"]: '"production"',
		},
	});
})();
