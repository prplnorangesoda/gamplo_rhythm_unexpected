declare namespace Gamplo {
	interface Player {
		// Unique player identifier.
		id: any;
		username: string;
		displayName: string;
		// Avatar URL or null
		image: string;
	}
}

declare const Gamplo: {
	apiBase: string;
	sessionId: any;
	player: any;
	initialized: boolean;
	readyHandlers: any[];
	resizeHandlers: any[];
	viewport: {
		width: number;
		height: number;
	};
	// heartbeatInterval: any;
	_handleMessage(e: any): void;
	_autoInit(): Promise<void>;
	_authenticate(e: any): Promise<void>;
	_startHeartbeat(): void;
	_endSession(): void;
	_getHeaders(): {
		"Content-Type": string;
		"x-sdk-session": any;
	};
	getSessionId(): any;
	onReady(e: () => void): void;
	isReady(): boolean;
	disconnect(): void;
	getViewport(): {
		width: number;
		height: number;
	};
	onResize(e: (width: number, height: number) => void): void;
	getPlayer(): Player;
	refreshPlayer(): Promise<any>;
	getAchievements(): Promise<any>;
	unlockAchievement(e: any): Promise<any>;
	getSave(e?: number): Promise<any>;
	setSave(e: any, t?: number): Promise<any>;
	deleteSave(e?: number): Promise<any>;
	listSaves(): Promise<any>;
};
