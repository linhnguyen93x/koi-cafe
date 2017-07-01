/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "React/RCTBundleURLProvider.h"
#import <React/RCTRootView.h>
#import <SystemConfiguration/CaptiveNetwork.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  //  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  
  
  jsCodeLocation = [NSURL URLWithString:@"http://10.252.99.24:8081/index.ios.bundle?platform=ios&dev=true"];


  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Koi"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [self fetchSSIDInfo];
q       000
  
  return YES;
}

- (NSDictionary *)fetchSSIDInfo
{
  NSArray *interfaceNames = CFBridgingRelease(CNCopySupportedInterfaces());
  NSLog(@"%s: Supported interfaces: %@", __func__, interfaceNames);
  
  NSDictionary *SSIDInfo;
  for (NSString *interfaceName in interfaceNames) {
    SSIDInfo = CFBridgingRelease(
                                 CNCopyCurrentNetworkInfo((__bridge CFStringRef)interfaceName));
    NSLog(@"%s: %@ => %@", __func__, interfaceName, SSIDInfo);
    
    BOOL isNotEmpty = (SSIDInfo.count > 0);
    if (isNotEmpty) {
      break;
    }
  }
  return SSIDInfo;
}

@end
