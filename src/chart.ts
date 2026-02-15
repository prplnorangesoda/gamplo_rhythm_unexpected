import log from "./log";

export interface JsonNote {
	// Beat
	b: number;
	// Lane
	l: number;
}
export interface JsonCenterNote {
	// Beat
	b: number;
}
export interface ChartData {
	notes: JsonNote[];
	center_notes: JsonCenterNote[];
}

export async function get_chart_from_url(url: string): Promise<ChartData> {
	log("Loading chart from url", url);
	return await (await fetch(url)).json();
}
