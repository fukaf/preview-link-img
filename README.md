# Preview Link Images

This is a Chrome extension that allows users to preview images from links on the current webpage. The extension fetches these links and uses a user-specified regular expression pattern to match and preview the images they point to.

## Features

- Preview images from links without navigating away from the current page.
- Specify a regular expression to match specific images from the fetched links.
- Easy to use options page for setting up the regular expression.

## Installation

1. Download or clone this repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable Developer mode (toggle switch in the top right corner).
4. Click on "Load unpacked" and select the directory of this extension.

## Usage

1. Navigate to the options page and specify the domain(`website`) that this extension operates on.
2. Set up your desired regular expression(`regex`) to match specific images.
3. Click 'Save' to store your settings.
4. Navigate to a webpage within the specified domain. If the domain matches the one in your settings, an icon (like the letter 'P') will appear on the top right of the page.
5. Click on the icon to activate the extension and preview images from links. The images will appear under the corresponding links.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).