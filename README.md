# CMHCal Consolidated Multi-echelon Horseblanket Calendar

CMHCal is designed to display horseblanket calendar information in an easily modifiable format that is quickly aggregated to other echelons.

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

To begin, add an organization to the calendar by entering the name of the organization and selecting 'Add Organization'. Next, select dates on the calendar for an event to take place. A prompt will appear to enter the name of the event.

A user may drag events to update the date range.

Check the 'Edit Mode' box to display options to change an event name, change an event link, toggle the event category, or delete the event.

Click the 'Show' checkbox next to Categories and Organizations to toggle their display.

## Exporting a Calendar

After entering calendar information, select the 'Export' button to download the calendar information in a JSON format.

## Importing a Calendar

To import a JSON CMHCal file, click the 'Import' button and then select the file. This will add all of the Organizations, Categories, and Events.

# CMHCal Design

CMHCal is designed to run 'stand-alone'. Once the single `index.html` file is delivered to a computer, all processing is done locally. This provides the ability for CMHCal to operate on disconnected computers. At this time, users must export and import CMHCal JSON files to share information.

CMHCal uses the ReactJS and  the `create react app` framework. CMHCal uses Redux for state management across components. CMHCal uses the FullCalendar Resource Timeline view.

There are two components used in CMHCal (in the `src/components` folder), `CalTools` and `ResourceCalendar`.

## CalTools

CalTools provides the top bar with import / export functionality as well as setting the calendar view ranges. CalTools provide a way to add Organizations and Categories to the calendar.

An 'Edit Mode On' checkbox allows a user to toggle 'Edit Mode' for better printing.

## ResourceCalendar

The resource calendar displays the calendar events in a 'horseblanket style' format (organizations in rows on the left, and days as columns). The top rows also display Month (MMM YY format), Fiscal Year Week (weeks since Oct 01 of that year), relative 'T' week (from the current date), and the day (DD day of the week format). In each of the rows, an organization appears on the left and events for that organization appear in the cells. There may be multiple events for a day (they will be displayed in the same row).

There are three views for the ResourceCalendar, Day View, Week View, and Month View. Each view displays day, week, or month granularity respectively. The views can be changed by selecting the 'Day View', 'Week View', or 'Month View' buttons at the top right of the calendar.

Events may be added by highlighting days with the mouse and entering a title. Events can be moved between organizations by dragging them. Event categories may be changed by clicking the 'Toggle Category' button on the event while in 'Edit Mode'.

## Redux

A 'reducer' handles the dispatched actions. Components dispatch actions that are handled by the reducer which changes the global state. Particular parts of the global state are read by each component. The reducer handles changes in state. Each modification action is written as a 'dispatch' with a 'payload'.

## CMHCal Data Structure

CMHCal uses a stored state that can be exported and imported to display categories, organizations, and events. The structure is below

```
{
  "calEvents": [
    {
      "title": "Event 1",
      "start": "2020-11-27",
      "end": "2020-12-02",
      "id": "1c0fbe65-2578-4101-ba3e-c15f12b75528",
      "resourceId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
      "category": "Category 1",
      "color": "orange",
      "url": ""
    },
    {
      "title": "Event 2",
      "start": "2020-11-30",
      "end": "2020-12-05",
      "id": "9951a408-a8ee-417c-a37c-9d5c585a4ca1",
      "resourceId": "63dab0c3-922e-47e4-844e-3e0e268bbc93",
      "url": "",
      "category": "Category 2",
      "color": "blue"
    },
    {
      "title": "Event 3",
      "start": "2020-11-27",
      "end": "2020-12-02",
      "id": "53652c79-89a5-4bbe-8e32-332e308ecbe9",
      "resourceId": "32d3aa15-804f-434c-8501-667e72a10bbc",
      "url": "",
      "category": "Category 1",
      "color": "orange"
    }
  ],
  "calResources": [
    {
      "id": "8d629f12-eac9-4289-bf09-7c2646d7694c",
      "title": "Org 1",
      "parentId": "",
    },
    {
      "id": "926f15e2-70f9-430e-8e41-f2869b694bf2",
      "title": "Org Nest 1",
      "parentId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
    },
    {
      "id": "63dab0c3-922e-47e4-844e-3e0e268bbc93",
      "title": "Org Nest 2",
      "parentId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
    },
    {
      "id": "32d3aa15-804f-434c-8501-667e72a10bbc",
      "title": "Org Nest 3",
      "parentId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
    },
    {
      "id": "7b6fd54d-b033-40e4-974e-ab31f84575ad",
      "title": "Lateral Org 4",
      "parentId": "",
    }
  ],
  "calCategories": [
    {
      "id": "349b8e84-ef4c-455c-9b87-04c351739325",
      "name": "Category 1",
      "color": "orange"
    },
    {
      "id": "3b02e586-d537-40ae-a4ad-61377dcdc239",
      "name": "Category 2",
      "color": "blue"
    }
  ],
  "calDateRangeStart": "2020-11-24",
  "calDateRangeEnd": "2021-01-05"
}
```

`calEvents` defines an array of objects that are each events.

```
"calEvents": [
  {
      "title": "Event 1",
      "start": "2020-11-27",
      "end": "2020-12-02",
      "id": "1c0fbe65-2578-4101-ba3e-c15f12b75528",
      "resourceId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
      "category": "Category 1",
      "color": "orange",
      "url": ""
  },
]
```

`calOrganizations` defines an array of objects that are each organizations (also known as Resources by FullCalendar). Organizations may be nested using the `parentId` field within each organization.

```
"calResources": [
    {
      "id": "8d629f12-eac9-4289-bf09-7c2646d7694c",
      "title": "Org 1",
      "parentId": "",
    },
    {
      "id": "63dab0c3-922e-47e4-844e-3e0e268bbc93",
      "title": "Org Nest 2",
      "parentId": "8d629f12-eac9-4289-bf09-7c2646d7694c",
    },
    {
      "id": "32d3aa15-804f-434c-8501-667e72a10bbc",
      "title": "Org Nest 3",
      "parentId": "63dab0c3-922e-47e4-844e-3e0e268bbc93",
    },
]
```

`calCategories` is an array of objects that define categories.

```
"calCategories": [
  {
    "id": "349b8e84-ef4c-455c-9b87-04c351739325",
    "name": "Category 1",
    "color": "orange"
  },
],
