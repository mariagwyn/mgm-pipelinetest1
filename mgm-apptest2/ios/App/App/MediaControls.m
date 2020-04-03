//
//  MediaControls.m
//  App
//
//  Created by Greg Johnston on 2/16/20.
//

#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(MediaControls, "MediaControls",
    CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(isAvailable, CAPPluginReturnPromise);
    CAP_PLUGIN_METHOD(initControls, CAPPluginReturnPromise);
   CAP_PLUGIN_METHOD(updateMetadata, CAPPluginReturnPromise);
   CAP_PLUGIN_METHOD(setPlaybackState, CAPPluginReturnPromise);
   CAP_PLUGIN_METHOD(setPositionState, CAPPluginReturnPromise);
)

