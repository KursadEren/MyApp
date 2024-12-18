#import "AppDelegate.h"
#import "RNFBMessagingModule.h"
#import <Firebase.h> // Firebase'i ekleyin
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase başlatması
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  // RNFBMessaging ile başlangıç props'unu ekleme
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  // React Native kök view ayarı
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:[self bridge]
                                                   moduleName:@"MyApp"
                                            initialProperties:self.initialProps];

  // RootView arka plan rengi
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0 green:1.0 blue:1.0 alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
