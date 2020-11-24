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


# CMHCal Design

CMHCal is designed to run 'stand-alone'. Once the single `index.html` file is delivered to a computer, all processing is done locally. This provides the ability for CMHCal to operate on disconnected computers. At this time, users must export and import CMHCal JSON files to share information.

CMHCal uses the ReactJS and `create react app` framework and Redux for state management across components. CMHCal is built using FullCalendar Resource Timeline view.

There are two components used in CMHCal (in the `src/components` folder), `CalTools` and `ResourceCalendar`

## CalTools

CalTools provides the top bar with import / export functionality as well as setting the calendar view ranges. CalTools provide a way to add Organizations and Categories to the calendar.

An 'Edit Mode On' checkbox allows a user to toggle 'Edit Mode' for better printing.

## ResourceCalendar

The resource calendar displays the calendar events in a 'horseblanket style' format (organizations on the left in rows, and days as columns). The top rows also display Month (MMM YY format), Fiscal Year Week (weeks since Oct 01 of that year), relative 'T' week (from today's date), and the day (DD day of the week format). In each of the rows, an organization appears on the left and events for that organization appear in the cells. There may be multiple events for a day (they will be displayed in the same row).

There are two views for the ResourceCalendar, Day View and Week View. Each view displays a day or week granularity respectively. The views can be changed by selecting the 'Day View' or 'Week View' buttons at the top right of the calendar.

Events may be added by highlighting days with the mouse and entering a title. Events can be moved between organizations by dragging them. Event categories may be changed by clicking the 'Toggle Category' button on the event while in 'Edit Mode'.

## Redux

A 'reducer' handles the dispatched actions. Components dispatch actions that are handled by the reducer and a global state is changed. Appropriate parts of the global state are read by each component. The reducer handles changes in state. Each modification action is written as a 'dispatch' with a 'payload'.
