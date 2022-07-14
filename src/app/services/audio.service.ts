import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Observable, takeUntil,Subject } from 'rxjs';
import { PlayerState } from '../classes/player-state';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private stop$ = new Subject();
  private audioFileObj = new Audio();

  audioEvents: string[] = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadmetadata",
    "loadstart"
  ];

  state: PlayerState = {
    error: false,
    playing: false,
    canPlay: false,
    duration: undefined,
    currentTime: undefined,
    readableCurrentTime: "",
    readableDuration: "",
  }
  
  private stateChange: BehaviorSubject<PlayerState> = new BehaviorSubject(
    this.state
  );


  constructor() { }

  playAudioStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioFileObj.play();
  }

  pause() {
    this.audioFileObj.pause();
  }

  stop() {
    this.stop$.next(true);
  }

  seekTo(seconds) {
    this.audioFileObj.currentTime = seconds;
  }

  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getState(): Observable<PlayerState> {
    return this.stateChange.asObservable();
  }

  private updateStateEvents(event: Event) {
    switch(event.type) {
      case "canplay":
        this.state.duration = this.audioFileObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canPlay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioFileObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = {
      error: false,
      playing: false,
      canPlay: false,
      duration: undefined,
      currentTime: undefined,
      readableCurrentTime: "",
      readableDuration: "",
    }
  }

  private streamObservable(url: string) {
    return new Observable(observer => {
      this.audioFileObj.src = url;
      this.audioFileObj.load();
      this.audioFileObj.play();

      const callback = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      }

      this.addAudioEvents(this.audioFileObj, this.audioEvents, callback);

      return () => {
        this.audioFileObj.pause();

        this.audioFileObj.currentTime = 0;

        this.removeAudioEvents(this.audioFileObj, this.audioEvents, callback);

        this.resetState();
      }
    })
  }

  private addAudioEvents(audio: HTMLAudioElement, audioEvents: string[], callback) {
    audioEvents.forEach((event: string) => audio.addEventListener(event, callback));
  }
  
  private removeAudioEvents(audio: HTMLAudioElement, audioEvents: string[], callback) {
    audioEvents.forEach((event: string) => audio.removeEventListener(event, callback));
  }
}
