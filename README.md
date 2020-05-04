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
        
### Getting started
Install package using npm
```
npm install ts-gantt
```
or using CDN
```
<script src="https://unpkg.com/ts-gantt/dist/ts-gantt.umd.min.js"></script>
```

### TODO list
<ul>
    <li>add optional multiple row selection</li>
    <li>add optional possibility to move/resize chart bars</li>
    <li>make grid columns resizable</li>
    <li>allow column reorder</li>
    <li>increase code coverage</li>
    <li>optimize task change detection</li>
    <li>add row virtualization</li>
</ul>

