//
//  MediaControls.swift
//  App
//
//  Created by Greg Johnston on 2/16/20.
//

import Foundation
import Capacitor
import MediaPlayer

@objc(MediaControls)
public class MediaControls: CAPPlugin {
  @objc func echo(_ call: CAPPluginCall) {
    let value = call.getString("value") ?? ""
    call.success([
        "value": value
    ])
  }
    @objc func isAvailable(_ call: CAPPluginCall) {
        call.success([
            "value": true
        ]);
    }
    
    @objc func initControls(_ call: CAPPluginCall) {
        let title = call.getString("title") ?? ""
        let artist = call.getString("artist") ?? ""
        let album = call.getString("album") ?? ""
        let artwork = call.getArray("artwork", String.self) ?? [String]()
        let livestream = call.getBool("livestream") ?? false
    
        do {
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print(error)
        }
        
        // set up remote controls
        let commandCenter = MPRemoteCommandCenter.shared()
        commandCenter.playCommand.addTarget { [unowned self] event in
            self.notifyListeners("play", data: [:])
            return .success
        }
        commandCenter.pauseCommand.addTarget { [unowned self] event in
            self.notifyListeners("pause", data: [:])
            return .success
        }
        commandCenter.previousTrackCommand.addTarget { [unowned self] event in
            self.notifyListeners("seekbackward", data: [:])
            return .success
        }
        commandCenter.nextTrackCommand.addTarget { [unowned self] event in
            self.notifyListeners("nexttrack", data: [:])
            return .success
        }
        
        // assign NowPlayingInfo
        var nowPlayingInfo = [String: Any]()
        
        nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = livestream
        nowPlayingInfo[MPMediaItemPropertyTitle] = title
        nowPlayingInfo[MPMediaItemPropertyArtist] = artist
        //nowPlayingInfo[MPMediaItemPropertyArtwork] = artwork
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album

        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        
        NSLog("%@", "**** Initialized NowPlaying: artist \(artist), album \(album), track \(title)")
                
        call.success([
            "value": true
        ]);
    }
    
    @objc func updateMetadata(_ call: CAPPluginCall) {
        do {
            try AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.playback)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print(error)
        }
        
        let title = call.getString("title") ?? ""
        let artist = call.getString("artist") ?? ""
        let album = call.getString("album") ?? ""
        let artwork = call.getArray("artwork", String.self) ?? [String]()
        let livestream = call.getBool("livestream") ?? false
        
        var nowPlayingInfo = [String: Any]()
        
        nowPlayingInfo[MPNowPlayingInfoPropertyIsLiveStream] = livestream
        nowPlayingInfo[MPMediaItemPropertyTitle] = title
        nowPlayingInfo[MPMediaItemPropertyArtist] = artist
        //nowPlayingInfo[MPMediaItemPropertyArtwork] = artwork
        nowPlayingInfo[MPMediaItemPropertyAlbumTitle] = album
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = 1.0
        
        MPNowPlayingInfoCenter.default().nowPlayingInfo = nowPlayingInfo
        
        NSLog("%@", "**** Updated NowPlaying: artist \(artist), album \(album), track \(title)")
        
        call.success([
            "value": true
        ]);
    }
    
    @objc func setPlaybackState(_ call: CAPPluginCall) {
//        let state = call.getString("state") ?? "playing"
 //       if #available(iOS 13.0, *) {
 //           MPNowPlayingInfoCenter.default().playbackState = state == "playing" ? .playing : .paused
  //      } else {
   //         NSLog("playbackState is not available")
    //    }
        call.success([
            "value": true
        ]);
    }
    
    @objc func setPositionState(_ call: CAPPluginCall) {
        let nowPlayingInfoCenter = MPNowPlayingInfoCenter.default()
        var nowPlayingInfo = nowPlayingInfoCenter.nowPlayingInfo ?? [String: Any]()
        
        let duration = call.getInt("duration") ?? 0
        let position = call.getInt("position") ?? 0
        let playbackRate = call.getInt("playbackRate") ?? 1
        
        NSLog("%@", "**** Set playback info: rate \(playbackRate), position \(position), duration \(duration)")
        nowPlayingInfo[MPMediaItemPropertyPlaybackDuration] = duration
        nowPlayingInfo[MPNowPlayingInfoPropertyElapsedPlaybackTime] = position
        nowPlayingInfo[MPNowPlayingInfoPropertyPlaybackRate] = playbackRate
        nowPlayingInfo[MPNowPlayingInfoPropertyDefaultPlaybackRate] = 1.0
        
        nowPlayingInfoCenter.nowPlayingInfo = nowPlayingInfo
        
        call.resolve();
    }
    
    @objc func endSession(_ call: CAPPluginCall) {
        do {
            try AVAudioSession.sharedInstance().setActive(false)
        } catch {
            print("Failed to deactivate audio session, error: \(error)")
        }
        
        call.success([
            "value": true
        ]);
    }
}

