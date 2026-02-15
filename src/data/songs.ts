//@ts-nocheck
import crafter2011_audio from "../../assets/crafter2011/song.mp3";

import dariacore_christmas_audio from "../../assets/dariacore_christmas/song.mp3";
import a_saph_audio from "../../assets/thisll_probably_be_quaver/song_ignorant.mp3";
import a_saph_chart from "../../assets/thisll_probably_be_quaver/easy.json" with { type: "file" };
//@ts-check
export interface SongData {
	name: string;
	artist: string;
	bpm: number;
	audio: string;
	color: string;
	charts: {
		easy?: string;
		normal?: string;
		hard?: string;
	};
}

export const SONGS = {
	crafter2011: {
		name: "I put crafter2011's brain through harmor to make this",
		artist: "Crungey",
		bpm: 196,
		audio: crafter2011_audio as string,
		color: "#000000",
		charts: {},
	},
	dariacore_christmas: {
		name: "A Very Dariacore Christmas",
		artist: "Crungey",
		bpm: 194,
		audio: dariacore_christmas_audio as string,
		color: "#000000",
		charts: {},
	},
	thisll_probably_be_quaver: {
		name: "this'll probably be charted on quaver eventually",
		artist: "S-Ame",
		bpm: 189,
		audio: a_saph_audio as string,
		color: "#FF00FF",
		charts: {
			easy: a_saph_chart,
		},
	},
};
