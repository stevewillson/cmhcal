# CMHCal Consolidated Multi-echelon Horseblanket Calendar

The CMHCal tool is designed to display information in an easily modifyable format that is quickly aggregated to other echelons.

![cmhcal_screenshot][screenshot_1]

[screenshot_1]: cmhcal_1.png "CMHCal Screenshot"

## Installation

1. Clone the git repository `git clone git@gitlab.com:stevewillson/cmhcal.git`
2. Change directory to the cloned repository `cd cmhcal`
3. Install dependencies `npm install`
4. Start a development server `npm start`
5. Browse to `localhost:3000` to use cmhcal

## Package to a single `index.html` file

1. Clone the git repository `git clone git@gitlab.com:stevewillson/cmhcal.git`
2. Change directory to the cloned repository `cd cmhcal`
3. Install dependencies `npm install`
4. Build the application `npm run build`
5. Generate the single `index.html` file: `npx gulp`
6. The generated file is located at: `./build/index.html`
7. Open this file locally on a computer with a web browser to use cmhcal without connecting to the internet
