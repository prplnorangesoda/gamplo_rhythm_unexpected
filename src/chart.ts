import log from "./log";

export interface Note {
	// Beat
	b: number;
	// Lane
	l: number;
}

export interface ChartData {
	notes: Note[];
}

export async function get_chart_from_url(url: string): Promise<ChartData> {
	log("Loading chart from url", url);
	return await (await fetch(url)).json();
}
