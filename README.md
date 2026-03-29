# Link Manager Extension

A Google Chrome extension built with JavaScript (Manifest V3) designed to help users save, categorize, and manage important links easily and quickly without leaving the current page.

## Key Features

* Auto-save: Automatically fetches the title and URL of the current page when the extension is opened.
* Flexible Categorization: Add custom categories with an autocomplete feature for previously saved categories.
* Interactive UI: Displays links grouped by category in collapsible lists.
* Advanced Search: Search bar for quick access to links by name or category.
* Full Management: Easily edit or delete saved links.
* Duplication Prevention: Alerts the user when trying to save an already existing link.
* Toast Notifications: Elegant popup notifications to confirm save or edit actions.

## Technologies Used

* HTML5
* CSS3 
* JavaScript (Vanilla JS, DOM Manipulation)
* Chrome Extensions API (Manifest V3, chrome.storage.local, chrome.tabs)

## Installation and Usage

1. Download or clone this repository to your local machine.
2. Open Google Chrome and navigate to: `chrome://extensions/`
3. Enable "Developer mode" in the top right corner.
4. Click the "Load unpacked" button and select the folder containing the extension files.
5. The extension icon will appear in your browser toolbar. You can now pin it and start using it.

## Proposed Future Developments

* Connect the extension to a cloud database like Supabase to sync users' links across different devices.
* Add an export and import feature for links in JSON format.

## Developer

Developed by: Mahmoud Ghosheh
https://www.linkedin.com/in/mahmoud-ghosheh
