# XKPasswd Firefox Extension

A Firefox browser extension for generating secure, memorable passwords using the XKPasswd algorithm from [xkpasswd.net](https://www.xkpasswd.net/).

## Features

- **XKPasswd Integration**: Uses the actual XKPasswd JavaScript library from xkpasswd.net
- **XKPasswd-style Passwords**: Word-based passwords inspired by XKCD's "Correct Horse Battery Staple"
- **Configurable Settings**: Customize number of words, word length, case transform, separators, and padding
- **One-Click Copy**: Copy generated passwords directly to clipboard
- **Offline Capable**: Uses bundled XKPasswd library, no internet connection required

## Development Setup

### Prerequisites
- Node.js and npm
- Firefox browser

### Building the Extension
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```

### Installation in Firefox

#### As a Temporary Add-on (Development)
1. Build the extension (see above)
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from this directory

#### Development Workflow
- Use `npm run watch` for automatic rebuilding during development
- Use `npm run build` for production builds

#### Note
The extension references icon files (`icon16.png`, `icon48.png`, `icon128.png`) in the manifest that are not included in this repository. You can either:
- Create your own icons at those sizes
- Remove the icon references from `manifest.json` (Firefox will use default icons)

## Usage

1. Click the XKPasswd extension icon in your browser toolbar
2. Customize password settings:
   - **Number of Words**: 2-10 words (default: 4)
   - **Word Length**: Min/max character length for words (default: 4-8)
   - **Case Transform**: How to capitalize words
   - **Separator**: Character between words (random, dash, underscore, period, or none)
   - **Padding**: Number of digits and symbols to add
3. Click "Generate Password" to create a new password
4. Click "Copy to Clipboard" to copy the password for use

Settings automatically update the password as you change them.

## How It Works

The extension uses the official XKPasswd library by:

1. Installing the xkpasswd-js package directly from GitHub as an npm dependency
2. Bundling the library using webpack for browser extension compatibility
3. Applying your custom configuration settings to the library
4. Using the authentic `XKPasswd.password()` method to generate passwords

This ensures you get the same high-quality, secure passwords as the official xkpasswd.net website, but works completely offline since the library is bundled with the extension.

## Project Structure

- `manifest.json` - Firefox extension manifest and configuration
- `popup.html` - Extension popup interface  
- `popup.js` - Extension UI logic and password generation coordination
- `src/extension.js` - Entry point that imports and exposes the XKPasswd library
- `webpack.config.js` - Build configuration for bundling the extension
- `dist/popup-bundle.js` - Built bundle containing the XKPasswd library (generated)

## Permissions

The extension requires the following permissions:
- `activeTab` - For basic extension functionality
- `clipboardWrite` - To copy passwords to clipboard

## Credits

- Based on the XKPasswd algorithm by [Bart Busschots](https://www.bartbusschots.ie/)
- XKPasswd library: https://github.com/bartificer/xkpasswd-js
- Inspired by the XKCD comic "Password Strength"

## License

This extension is provided as-is for educational and personal use. The XKPasswd algorithm and library are licensed under the 2-clause BSD license.

