const { withAndroidStyles } = require('expo/config-plugins');

/**
 * Utsav is light-theme-only (04_UI_Design_System) and never follows the
 * system's dark mode. Two independent Android behaviors need opting out of,
 * since expo-system-ui's userInterfaceStyle only affects which resources are
 * selected, not either of these:
 *
 * 1. Force Dark — the renderer auto-inverts colors on devices with system
 *    dark mode on (default forceDarkAllowed is true on targetSdk 29+).
 * 2. Theme.AppCompat.DayNight itself resolves its own dark resource variants
 *    when the system is in night mode, independent of Force Dark — so even
 *    with Force Dark off, the base theme's window background still goes dark
 *    before any RN content mounts. Using a plain (non-DayNight) light theme
 *    avoids this entirely.
 */
function withAndroidLightThemeOnly(config) {
  return withAndroidStyles(config, (config) => {
    const appTheme = config.modResults.resources.style?.find(
      (style) => style.$.name === 'AppTheme'
    );

    if (appTheme) {
      if (appTheme.$.parent === 'Theme.AppCompat.DayNight.NoActionBar') {
        appTheme.$.parent = 'Theme.AppCompat.Light.NoActionBar';
      }

      const alreadySet = appTheme.item?.some(
        (item) => item.$.name === 'android:forceDarkAllowed'
      );

      if (!alreadySet) {
        appTheme.item = appTheme.item ?? [];
        appTheme.item.push({
          _: 'false',
          $: { name: 'android:forceDarkAllowed' },
        });
      }
    }

    return config;
  });
}

module.exports = withAndroidLightThemeOnly;
