# CMHCal Consolidated Multi-echelon Horseblanket Calendar

The CMHCal tool is designed to display horseblanket calendar information in an easily modifiable format that is quickly aggregated to other echelons.

![cmhcal_screenshot][screenshot_1]

[screenshot_1]: cmhcal_1.png "CMHCal Screenshot"

## Installation

1. Clone the git repository `git clone git@gitlab.com:cmhcal/cmhcal.git`
2. Change directory to the cloned repository `cd cmhcal`
3. Install dependencies `npm install`
4. Start a development server `npm start`
5. Browse to `localhost:3000` to use cmhcal

## Package to a single `index.html` file

1. Clone the git repository `git clone git@gitlab.com:cmhcal/cmhcal.git`
2. Change directory to the cloned repository `cd cmhcal`
3. Install dependencies `npm install`
4. Build the application `npm run build`
5. Generate the single `index.html` file: `npx gulp`
6. The generated file is located at: `./build/index.html`
7. Open this file locally on a computer with a web browser to use cmhcal without connecting to the internet


# Usage

To begin, add an organization to the calendar by entering the name of the organization and selecting 'Add Organization'. Next, select dates on the calendar for an event to take place. A prompt will appear to enter the name of the event taking place on that date.

A user may drag events to change the date.

Check the 'Edit Mode' box to display options to change an event name, change an event link, toggle the event category, and delete the event.

Select the 'Show' checkbox next to Categories and Organizations to toggle their display.

## Exporting a Calendar

Once calendar information has been entered, select the 'Export' button to download the calendar information in a JSON format.

## Importing a Calendar

A JSON CMHCAL file may be imported by selecting the 'Import File' button and then selecting the file. This will include all of the Organizations, Categories, and Events.




