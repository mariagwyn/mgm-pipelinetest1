import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { CapacitorMusicControls, CapacitorMusicControlsInfo } from 'capacitor-music-controls-plugin';
import { Plugins } from '@capacitor/core';
const { CapacitorMusicControls } = Plugins;

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaControlsService {
  controls$ : Subject<string> = new Subject();

  constructor(
    private platform: Platform
  ) { }

  isAvailable() : boolean {
    return this.platform.is('capacitor') || 'mediaSession' in navigator;
  }

  init(options : CapacitorMusicControlsInfo) : Subject<string> {
    this.setMetadata(options);
    let controls$ = this.controls$;

    if(this.platform.is('capacitor')) {
      CapacitorMusicControls.addListener('controlsNotification', (action: any) => {
        console.log(`(MediaControlsService) (init) (action) -- ${action} = ${JSON.stringify(action)}`);
        switch(action.message) {
          case 'music-controls-next':
            // next
            controls$.next('nexttrack');
            break;
          case 'music-controls-previous':
            // previous
            controls$.next('previoustrack');
            break;
          case 'music-controls-pause':
            controls$.next('pause');
            // paused
            break;
          case 'music-controls-play':
            controls$.next('play');
            // resumed
            break;
          case 'music-controls-destroy':
            // controls were destroyed
            controls$.next('stop');
            break;
          case 'music-controls-skip-forward':
            controls$.next('seekforward');
            break;
          case 'music-controls-skip-backward':
            controls$.next('seekbackward');
            break;
          default:
            break;
        }
      });
    } else {
      if ('mediaSession' in navigator) {
        // @ts-ignore
        navigator.mediaSession.setActionHandler('play', async function() {
          controls$.next('play');
          // @ts-ignore
          navigator.mediaSession.playbackState = 'playing';
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler('pause', async function() {
          controls$.next('pause');
          // @ts-ignore
          navigator.mediaSession.playbackState = 'paused';
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler('seekbackward', function() {
          controls$.next('seekbackward');
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler('seekforward', function() {
          controls$.next('seekforward');
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler('previoustrack', function() {
          controls$.next('previoustrack');
        });
        // @ts-ignore
        navigator.mediaSession.setActionHandler('nexttrack', function() {
          controls$.next('nexttrack');
        });
      } else {
        console.warn('Media Session API is not available in your browser.');
      }
    }

    return this.controls$;
  }

  setMetadata(options : CapacitorMusicControlsInfo) {
    if(this.platform.is('capacitor')) {
      options.hasNext = true;
      options.hasPrev = true;
      options.hasSkipForward = false;
      options.hasSkipBackward = false;
      options.hasClose = false;
      options.dismissable = false;
      options.isPlaying = options.isPlaying || true;
      options.cover = 'assets/icon/venite-256.png';
      options.playIcon = 'media_play';
      options.pauseIcon = 'media_pause';
      options.prevIcon = 'media_prev';
      options.nextIcon = 'media_next';
      options.closeIcon =  'media_close';
      options.notificationIcon = 'notification';
      options.ticker = options.track;

      CapacitorMusicControls.create(options);
    } else {
      if ('mediaSession' in navigator) {
        // @ts-ignore
        navigator.mediaSession.metadata = new MediaMetadata({
          title: options.track,
          artist: options.artist,
          album: options.album,
          artwork: [
            { src: '/assets/icon/venite-256.png', sizes: '256x256', type: 'image/png' },
            { src: '/assets/icon/venite-512.png', sizes: '512x512', type: 'image/png' }
          ]
        });

        return true;
      } else {
        console.warn('Media Session API is not available in your browser.');
      }
    }
  }

  setPlaybackState(playing : boolean) : void {
    if(this.platform.is('capacitor')) {
      // @ts-ignore
      CapacitorMusicControls.updateIsPlaying({isPlaying: playing});
    } else {
      if ('mediaSession' in navigator) {
        console.log(`setting playbackState to ${playing ? 'playing' : 'paused'}`);
        // @ts-ignore
        navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
      } else {
        console.warn('Media Session API is not available in your browser.');
      }
    }
  }

  setPositionState(options: { duration: number; position: number; playbackRate?: number; }) : void {
    if(this.platform.is('capacitor')) {
      CapacitorMusicControls.updateElapsed({
				elapsed: options.position,
				isPlaying: options.playbackRate == 1
			});
    } else {
      // @ts-ignore
      if ('mediaSession' in navigator && navigator.mediaSession.hasOwnProperty('setPositionState')) {
        // @ts-ignore
        navigator.mediaSession.setPositionState({
          duration: options.duration,
          position: options.position,
          playbackRate: options.playbackRate || 1
        });
      } else {
        console.warn('Media Session API/setPositionState() is not available in your browser.');
      }
    }
  }

  endSession() : void {
    if(this.platform.is('capacitor')) {
      CapacitorMusicControls.destroy();
    } else {
      if ('mediaSession' in (navigator)) {
        // @ts-ignore
        navigator.mediaSession.setActionHandler('play', null);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('pause', null);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('seekbackward', null);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('seekforward', null);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('previoustrack', null);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('nexttrack', null);
        // @ts-ignore
        navigator.mediaSession.metadata = null;
      } else {
        console.warn('Media Session API is not available in your browser.');
      }
    }
  }
}
