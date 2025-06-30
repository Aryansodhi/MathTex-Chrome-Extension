# MathTeX

MathTeX is a Chrome extension that enables users to type, preview, and insert LaTeX-style mathematical expressions into any website. It provides a convenient math input panel with symbol tabs and live KaTeX rendering.

## Features

- Insert math symbols through categorized tabs such as Basic, Calculus, Trigonometry, Matrix, and more  
- Editable yellow placeholders in the rendered preview  
- Two-way sync between LaTeX input and the preview panel  
- Keyboard navigation using arrow keys between placeholders  
- Convert LaTeX math into a rendered image and copy it to clipboard  
- Works on most websites including Google, WhatsApp Web, and other input-supported platforms  
- Drag, minimize, maximize, and resize the panel as needed  

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle at the top right.
4. Click **Load unpacked** and select the folder containing the extension files.

## Folder Structure
```text
MathTeX/
├── manifest.json
├── contentScript.js
├── contentStyle.css
├── html2canvas.min.js
├── icon.png
└── katex/
    ├── katex.min.js
    ├── katex.min.css
    └── fonts/
```

## Usage

1. Click inside a text input or editable area on any webpage.
2. A **Σ** button will appear next to the field. Click it to open the MathTeX panel.
3. Use the tabbed interface to select and insert math symbols, or type LaTeX manually.
4. Edit yellow placeholders directly in the preview panel.
5. Press the **Send** button to copy the rendered math expression as an image to your clipboard.
6. Paste the image (Ctrl+V) into supported input fields like WhatsApp, Gmail, etc.
