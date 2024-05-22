<!-- Partially used readme template from https://github.com/othneildrew/Best-README-Template -->
<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/fukaf/preview-link-img">
    <img src="icons/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Preview Link Images</h3>

  <p align="center">
    A Chrome extension allows users to preview images from links on the current webpage.
    <br />
    <a href="https://github.com/fukaf/preview-link-img"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/fukaf/preview-link-img">View Demo</a>
    ·
    <a href="https://github.com/fukaf/preview-link-img/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/fukaf/preview-link-img/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

# About The Project

This is a Chrome extension that allows users to preview images from links on the current webpage. The extension fetches these links and uses a user-specified regular expression pattern to match and preview the images they point to.

## Features

- Preview images from links without navigating away from the current page.
- Specify a regular expression to match specific images from the fetched links.
- Easy to use options page for setting up the regular expression.
- Creates a link database to store links that have already been previewed.
- Includes a 'Back to Top' icon for easy navigation.

## Installation

1. Download or clone this repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable Developer mode (toggle switch in the top right corner).
4. Click on "Load unpacked" and select the directory of this extension.

## Usage

### Setting Up the Extension

1. Navigate to the options page. (Click the icon of the extension and there is an 'options' button or right-click on the extension icon and select 'Options'.)
2. Specify the domain (`website`) that this extension operates on.
3. Set up your desired regular expression (`regex`) to match specific images.
4. Click 'Save' to store your settings.

### Activating the Extension

1. Navigate to a webpage within the specified domain. If the domain matches the one in your settings, an icon (like the letter 'P') will appear on the top right of the page.

2. Click on the icon to activate the extension. The images will appear under the corresponding links.

### Back to Top Icon

1. A 'Back to Top' arrow icon will appear on the bottom right of the page when you scroll down by default.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the [GPL 3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).