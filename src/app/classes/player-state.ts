export class PlayerState {
    error: boolean;
    playing: boolean;
    canPlay: boolean;
    duration: number | undefined;
    currentTime: number | undefined;
    readableCurrentTime: string;
    readableDuration: string;
}
