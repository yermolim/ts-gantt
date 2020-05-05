# TsGantt
<p align="left">
    <a href="https://www.npmjs.com/package/ts-gantt"><img
            src="https://img.shields.io/npm/v/ts-gantt" alt="Npm"></a>
    <a href="https://circleci.com/gh/yermolim/ts-gantt"><img
            src="https://circleci.com/gh/yermolim/ts-gantt.svg?style=shield" alt="Build Status"></a>
    <a href="https://codecov.io/gh/yermolim/ts-gantt"><img
            src="https://img.shields.io/codecov/c/github/yermolim/ts-gantt/master.svg?style=flat-round" alt="Codecov"></a>
    <a href="https://github.com/yermolim/ts-gantt/blob/master/LICENSE"><img
            src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-round" alt="License"></a>
    <br>
</p>

Simple library for creating gantt chart combined with task grid.

### Current features
<ul>
    <li>highly customizable</li>
    <li>contains two resizable parts: task grid and Gantt chart</li>
    <li>tree-like structure with expandable and selectable rows</li>
    <li>support for tasks with two date pairs (planned and actual)</li>
    <li>localization support
        <ul>
            <li>three out-of-box supported languages: English, Ukrainian, Russian</li>
            <li>custom locales support</li>
            <li>instant locale switching</li>
        </ul>
    </li>
    <li>configurable chart
        <ul>
            <li>four available chart scales: day, week, month, year</li>
            <li>three available chart display modes: planned dates, actual dates, both</li>
            <li>instant chart scale and display mode switching</li>
        </ul>
    </li>
    <li>written completely in Typescript</li>
    <li>light codebase: only one dependency (lightweight <a href="https://github.com/iamkun/dayjs">Day.js<a> is used to work with dates)</li>
</ul>
      
      
## Getting started

### Install and initialize
#### With npm
```
npm install ts-gantt
```

```javascript
import { TsGantt } from "ts-gantt";

const chart = new TsGantt("#container-selector");
```
include stylesheet ('ts-gantt/dist/styles.min.css') in any suitable way

#### Or using CDN
```html
<link rel="stylesheet" href="https://unpkg.com/ts-gantt/dist/styles.min.css">
<script src="https://unpkg.com/ts-gantt/dist/ts-gantt.umd.min.js"></script>
```
```javascript
const chart = new tsGantt.TsGantt("#container-selector");
```

#### ⚠️for chart to function properly its container element must have relative, absolute or fixed position!

### Set your task list
your tasks must implement following interface
```javascript
interface TsGanttTaskModel {
  id: string; // to avoid incorrect behaviour please use unique ids within array
  parentId: string | null | undefined; // use if you need tree-like structure

  name: string;  
  progress: number; // percentage from 0 to 100. higher or lower values will be truncated

  datePlannedStart: Date | null | undefined;
  datePlannedEnd: Date | null | undefined;  
  dateActualStart: Date | null | undefined;
  dateActualEnd: Date | null | undefined;
  
  localizedNames: {[key: string]: string} | null | undefined; // eg {"en": "Name", "uk": "Ім'я", "ru": "Имя"}
}
```
to pass your task array to chart use 'tasks' property setter
```javascript
chart.tasks = yourTaskArray;
```
task are updated in the same way. you should just pass actual task array when any change happens. change detection will find tasks that have been changed/added/removed and will replace/add/remove them in chart.
### Switch modes
#### Language
you can instantly switch chart language
```javascript
chart.locale = locale; // "en" | "uk" | "ru" or any custom locale you provided in chart options
```
#### Timeline scale
you can instantly switch chart timeline scale
```javascript
chart.chartScale = scale; // "day" | "week" | "month" | "year"
```
#### Display mode (chart bars)
you can instantly switch chart bar display mode
```javascript
chart.chartDisplayMode = mode; // "planned" | "actual" | "both"
```
"planned" - show only planned dates bar on timeline <br/>
"actual" - show only actual dates bar on timeline 

### Customize chart
you can customize chart in two ways: 
<ul>
    <li>edit or override styles in styles.css file</li>
    <li>provide custom options to 'TsGantt' class constructor</li>
</ul>

#### Css
preffered way to customize styling is to change css variable values
```css
:root {
  --tsg-table-min-width: 100px;
  --tsg-chart-min-width: 100px;
  --tsg-nesting-indent: 20px; /* indent width per nesting level */
  
  --tsg-background-color: white;
  --tsg-foreground-color: black;
  --tsg-separator-color: rgb(80, 80, 80); /* color of movable vertical line between parts */
  --tsg-header-color: rgb(210, 210, 210); /* header background color */
  --tsg-border-color: rgb(190, 190, 190);
  --tsg-symbol-color: rgb(80, 80, 80); /* color of row special symbols */
  --tsg-selection-color: rgb(230, 230, 230); /* background color of selected row */
  
  --tsg-chart-bar-color-1: skyblue; /* chart bars colors */
  --tsg-chart-bar-color-2: lightcoral;
  --tsg-chart-bar-accent-1: darkcyan;
  --tsg-chart-bar-accent-2: darkred;  
  
  --tsg-font-family: 'Calibri', sans-serif;
  --tsg-font-size: 14px;
  --tsg-line-height: 16px;
  --tsg-max-cell-text-lines: 2; /* max lines of multiline text */
}
```
#### Options
you can apply your custom options by passing options objects with the properties you need as second parameter to 'TsGantt' constructor
```javascript
const chart = new TsGantt("#container-selector", options); // esm
const chart = new tsGantt.TsGantt("#container-selector", options); // umd
```

<details><summary>ℹ️ complete list of 'TsGanttOptions' class properties you can use</summary>
<p>
  
 
```javascript
   // some default values ommited for brevity. you can always see them in 'TsGanttOptions' source code

  // columns order: "Name", "Progress", "Start date planned", "End date planned",
  // "Start date actual", "End date actual", "Duration planned", "Duration actual"
  columnsMinWidthPx: number[]; // array of 8 values, one for each of 8 columns. 0 to disable column
  columnsContentAlign: ("start" | "center" | "end")[]; // array of 8 values, one for each of 8 columns.

  separatorWidthPx = 5; // vertical central line width
  headerHeightPx = 90; // lower values are not recommended, but you can still try
  rowHeightPx = 40; // lower values are not recommended, but you can still try
  borderWidthPx = 1;
  barStrokeWidthPx = 2;
  barMarginPx = 2;
  barCornerRadiusPx = 6;
  
  // special row symbols. you can also use some HTML code
  rowSymbols: TsGanttRowSymbols = {childless: "◆", collapsed: "⬘", expanded: "⬙"};

  chartShowProgress = true; // indicating progress percentage on chart bar using different color
  chartDisplayMode: "planned" | "actual" | "both";
  chartScale: "day" | "week" | "month" | "year";
  
  // optimal spare space on timeline edges in days
  chartDateOffsetDays: {[key: string]: number} = {"day": 14, "week": 60, "month": 240, "year": 730};
  // minimal spare space on timeline edges in days
  // chart timeline is redrawn only when trespassing minimal distance to chart edge to nearest bar
  chartDateOffsetDaysMin: {[key: string]: number} = {"day": 7, "week": 30, "month": 120, "year": 365};
  // width of 1 day on timeline. not recommended to use lower values than default
  chartDayWidthPx: {[key: string]: number} = {"day": 60, "week": 20, month": 3, "year": 1};

  locale = "en"; // default locale
  localeDecimalSeparator: {[key: string]: string} = {en: ".", uk: ",", ru: ","};
  // you can provide any format strings that supported by dayjs
  localeDateFormat: {[key: string]: string} = {en: "MM/DD/YYYY", uk: "DD.MM.YYYY", ru: "DD.MM.YYYY"};
  localeFirstWeekDay: {[key: string]: number} = {en: 0, uk: 1, ru: 1}; // Sunday is 0
  localeDateMonths: {[key: string]: string[]}; // array of 12 string values for each locale. eg ["January", "February", ...etc]  
  localeDateDays: {[key: string]: string[]}; // array of 7 string values for each locale. eg ["Sunday", "Monday", ...etc]
  localeDateDaysShort: {[key: string]: string[]}; // array of 7 string values for each locale. eg ["Su", "Mo", ...etc]
  
  localeDateScale: {[key: string]: string[]}; // array of 3 string values for each locale. eg ["Weeks", "Months", "Years"]
  localeHeaders: {[key: string]: string[]}; // array of 8 string values for each locale
  localeDurationFormatters: {[key: string]: (duration: number) => string}; // duration formatter function for each locale

  // default column value getters return localized values by taking into account all the properties assigned above
  // but you can provide your own ones if you need more complex output 
  // returned value is assigned to cell's innerHTML property. so you can use html tags
  columnValueGetters: ((a: TsGanttTask) => string)[]; // array of 8 string value getters for each locale
```
</p>
</details>


## TODO list
<ul>
    <li>add optional multiple row selection</li>
    <li>add optional possibility to move/resize chart bars</li>
    <li>make grid columns resizable</li>
    <li>allow column reorder</li>
    <li>increase code coverage</li>
    <li>optimize task change detection</li>
    <li>add row virtualization</li>
</ul>

