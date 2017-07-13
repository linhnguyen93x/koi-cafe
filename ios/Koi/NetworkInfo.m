//
//  NetworkInfo.m
//  Koi
//
//  Created by Khang Nguyen on 7/7/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "NetworkInfo.h"

#import <SystemConfiguration/CaptiveNetwork.h>

@implementation NetworkInfo 

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getMACAddress:(RCTResponseSenderBlock)callback)
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
  //callback(@[[NSNull null], SSIDInfo[@"BSSID"]]);
  callback(@[[NSNull null], @"aaa"]);
}

@end
