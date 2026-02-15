export async function sleep(millis: number) {
	await new Promise((resolve, reject) => {
		setTimeout(resolve, millis);
	});
}
