# sd_pausemenu

A modern custom pause menu for FiveM built with Lua, React, TypeScript, and Vite.

This resource replaces the default pause menu flow with a cleaner custom UI, a live restart timer, a Discord shortcut, camera effects, and quick access to map, settings, reporting, and disconnect actions.

## Features

- Custom pause menu UI
- Restart countdown pulled from the server
- Discord button with configurable invite link
- GTA frontend support for map and settings
- Camera and depth of field effects while the menu is open
- Vehicle and frontend control disabling to prevent unwanted input
- Easy configuration through `shared/config.lua`

## Requirements

- FiveM server
- `ox_lib`

## Installation

1. Place the resource in your server resources folder.
2. Make sure `ox_lib` is installed and started before this resource.
3. Add the resource to your server config:

```cfg
ensure ox_lib
ensure sd_pausemenu
```

## Web UI Build

The resource uses a Vite-based web UI located in `web/`.

1. Open the `web` folder.
2. Install dependencies:

```bash
npm install
```

3. Start development mode:

```bash
npm run dev
```

4. Build the production UI:

```bash
npm run build
```

The built UI is loaded from `web/dist/index.html` via `fxmanifest.lua`.

## Configuration

Main configuration is located in [config.lua](file:///e:/sSwapping%20Dev%20Servers/qbox/txData/Qbox_60F577.base/resources/%5Bdev%5D/sd_pausemenu/shared/config.lua).

### `restartTimes`

Defines the server restart times shown in the pause menu.

```lua
restartTimes = {'05:00', '17:00'}
```

### `discordLink`

Defines the URL opened by the Discord button.

```lua
discordLink = "https://discord.gg/yourDiscordLink"
```

### `vehicleControls`

List of control IDs disabled while the pause menu is open inside a vehicle.

### `frontendControls`

List of control IDs disabled while the GTA frontend is active.

## Actions

The pause menu currently supports the following actions:

- Back to game
- Map
- Settings
- Reports
- Disconnect

The report callback is intentionally left open for custom integration in [client.lua](file:///e:/sSwapping%20Dev%20Servers/qbox/txData/Qbox_60F577.base/resources/%5Bdev%5D/sd_pausemenu/client/client.lua).

## `LocalPlayer.state.disablepausemenu`

This resource checks `LocalPlayer.state.disablepausemenu` before allowing the pause menu to open.

If this state is set to `true`, pressing `Escape` will not open the custom pause menu.

This is useful when another system should temporarily block the pause menu, for example:

- during character creation
- while a minigame is active
- during cutscenes
- while using another locked UI flow

### Example

```lua
LocalPlayer.state.disablepausemenu = true
```

Enable it again when the player is allowed to open the pause menu:

```lua
LocalPlayer.state.disablepausemenu = false
```

## Performance

Measured resource usage:

- Idle: `0.01 ms`
- In pause menu: `0.03 - 0.04 ms`
- In vehicle: `0.03 - 0.5 ms`

## Notes

- The resource disables the native pause menu to avoid overlap with the custom UI.
- Map and settings open the GTA frontend in a controlled way.
- The disconnect action uses `DropPlayer` with the localized drop reason.
- The restart timer is calculated server-side and sent to the UI when the menu opens.

## Customization

- Edit menu timings and Discord link in [config.lua]
- Edit the UI in `web/src/`
- Rebuild the UI after web changes with `npm run build`

## Credits

- Author: `sSwapping Development`
