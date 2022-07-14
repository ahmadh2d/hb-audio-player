import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { AudioFile } from '../classes/audio-file';

@Injectable({
  providedIn: 'root',
})
export class AudioFilesService {
  audioFilesData: AudioFile[] = [
    {
      url:"../../assets/music/Bohemian Rhapsody - Queen.mp3",
      name: "Bohemian Rhapsody",
      artist: "Queen"
    },
    {
      url:"../../assets/music/Creep-Radiohead-cover.mp3",
      name:"Creep",
      artist: "Radiohead (Cover)",
    },
    {
      url: "../../assets/music/hillary_duff_sparks.mp3",
      name: "Sparks",
      artist: "Hillary Duff"
    },
    {
      url: "../../assets/music/hillary_duff_sparks.mp3",
      name: "Sparks",
      artist: "Hillary Duff"
    },
  ];

  constructor() {}

  getAudioFiles(): Observable<AudioFile[]> {
    return of<AudioFile[]>(this.audioFilesData);
  }
}
