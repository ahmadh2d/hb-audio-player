import { Component, OnInit } from '@angular/core';
import { AudioFile } from 'src/app/classes/audio-file';
import { PlayerState } from 'src/app/classes/player-state';
import { AudioFilesService } from 'src/app/services/audio-files.service';
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  files: AudioFile[] = [];

  currentFile: any = {};

  state: PlayerState;

  constructor(
    private _audioFilesService: AudioFilesService,
    private _audioPlayerService: AudioService
  ) {
    this.getAudioFiles();
    this.listenToPlayerState();
  }
  ngOnInit(): void {}

  listenToPlayerState() {
    this._audioPlayerService.getState().subscribe({
      next: (state) => {
        this.state = state;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getAudioFiles() {
    this._audioFilesService.getAudioFiles().subscribe({
      next: (data: AudioFile[]) => {
        this.files = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  openFile(file: AudioFile, index: number) {
    this.currentFile = { file, index };
    this._audioPlayerService.stop();
    this.playStream(file.url);
  }

  onSliderChangeEnd(event: any) {
    this._audioPlayerService.seekTo(event.value);
  }

  play() {
    this._audioPlayerService.play();
  }

  pause() {
    this._audioPlayerService.pause();
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];

    this.openFile(file, index);
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];

    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  private playStream(url) {
    this._audioPlayerService.playAudioStream(url).subscribe(() => {});
  }
}
