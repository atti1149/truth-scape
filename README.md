# Truth-Scape

## Overview

Truth-Scape is a browser extension that adds a widget to Wikipedia pages. With a single click, you can check how trustworthy the page is, view red flags, and see a score from 0–100. Feel free to customize or extend the project however you like.

## Installation (For Developers)

### Cloning to machine

```bash
cd C:\Where\You\Want\This\To\Go
git clone https://github.com/atti-1149/truth-scape.git
cd truth-scape
npm install
```

### Setting up the API Key

1. Go to console.groq.com
2. Click create or login to your account
3. Navigate to API keys
4. Create a new API key
5. Open the .env.example file
6. Paste it into the GROQ_API_KEY field
7. Rename the file from .env.example to .env
8. Run: dotenvx encrypt
8. Save the project

## Testing

### Extension
1. Go to {brower name}://extensions
2. Turn on developer mode
3. Load unpacked
4. Open this project
5. Open the public folder
6. Select the extenson folder
7. Go to any Wikipedia page
8. You should see a rate button

Whenever you make updates to source code in public/extension: go to {browser name}://extensions, find your extension, and select Reload

### Server
Run: npm start

## Dependencies

- Express
- Dotenvx
- groq-sdk

## Licence
See licence file

## Additional notes

To change the default port, edit the PORT variable in .env
