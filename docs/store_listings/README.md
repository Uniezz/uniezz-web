# uniezz store listing assets

Last edited: 2026-11-03.

Selected design: the cat-shaped **u**, ink `#0C0D14` on blue `#5B7CFF`. Editable source: [uniezz-web-app.pen](../design/uniezz-web-app.pen), icon `ujpZi`, export board `L5jki`.

## Files

| File                                                                                                     | Size      | Use                                                                                            |
| -------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| [ios/App-Icon-1024x1024@1x.png](ios/App-Icon-1024x1024@1x.png)                                           | 1024×1024 | Matches the filename in the native iOS AppIcon asset catalog. Square, opaque artwork.          |
| [shared/icon.png](shared/icon.png)                                                                       | 1024×1024 | Matches the Expo `assets/images/icon.png` source filename.                                     |
| [shared/splash-screen.png](shared/splash-screen.png)                                                     | 1024×1024 | Matches the Expo splash source filename; transparent ink mark.                                 |
| [android/play-store-icon.png](android/play-store-icon.png)                                               | 512×512   | Store listing icon.                                                                            |
| [android/play-feature-graphic.png](android/play-feature-graphic.png)                                     | 1024×500  | Store feature graphic.                                                                         |
| [android/mipmap-xxxhdpi/ic_launcher.webp](android/mipmap-xxxhdpi/ic_launcher.webp)                       | 192×192   | Matches the native Android resource name and xxxhdpi dimensions.                               |
| [android/mipmap-xxxhdpi/ic_launcher_round.webp](android/mipmap-xxxhdpi/ic_launcher_round.webp)           | 192×192   | Round launcher artwork with transparent corners.                                               |
| [android/mipmap-xxxhdpi/ic_launcher_foreground.webp](android/mipmap-xxxhdpi/ic_launcher_foreground.webp) | 432×432   | Transparent adaptive foreground, matching the native resource name and xxxhdpi dimensions.     |
| [android/ic_launcher_background.png](android/ic_launcher_background.png)                                 | 1024×1024 | Blue background reference. The native app currently uses a color resource instead of this PNG. |
| [android/ic_launcher_monochrome.png](android/ic_launcher_monochrome.png)                                 | 1024×1024 | Transparent white monogram for themed icon setup.                                              |
| [web/favicon.png](web/favicon.png)                                                                       | 32×32     | Browser icon.                                                                                  |

Names were checked against `uniezz-mobile/app.json`, the iOS AppIcon catalog, and Android launcher resources. The mobile app uses the selected icon as its Expo source, and its local generated assets were refreshed. The mobile repo ignores `ios` and `android`, so a native rebuild regenerates those files from the committed source assets. The adaptive foreground source is `assets/images/adaptive-icon.png`, with blue `#5B7CFF` behind it.

## Regenerate

Export from pen.dev, then rename its node-ID filenames to the names above:

- `Z8xacj`: base icon — PNG at scale `3.2` for 1024px, `1.6` for 512px, `0.1` for 32px; WebP at `0.6` for 192px.
- `ZCbJH`: adaptive foreground — WebP at scale `1.35` for 432px.
- `GpKU4`: background — PNG at scale `3.2`.
- `kNOAY`: monochrome — PNG at scale `3.2`.
- `QrOJ4`: splash — PNG at scale `3.2`.
- `Ur9on`: feature graphic — PNG at scale `2`.

For `ic_launcher_round.webp`, copy `Z8xacj`, set its corner radius to `160` on the 320px frame, export WebP at scale `0.6`, then delete the temporary copy. Keep the main icon square so each platform applies its own mask.

Save the opaque iOS, shared icon, and store listing PNGs as RGB after exporting; pen.dev includes an alpha channel even when all pixels are opaque. Keep transparency in the foreground, monochrome, round launcher, and splash assets.
