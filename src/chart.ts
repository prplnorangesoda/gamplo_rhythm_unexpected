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

export async function parse_chart(chart: ChartData) {
	log("Parsing chart:", chart);
}
export async function parse_chart_from_url(url: string) {
	return parse_chart(await (await fetch(url)).json());
}
