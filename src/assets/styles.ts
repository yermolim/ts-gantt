/// <reference path="./assets.d.ts" />

export const styles = /*html*/`
<style>
  :host {
    --tsg-table-min-width-final: var(--tsg-table-min-width, 100px);
    --tsg-chart-min-width-final: var(--tsg-chart-min-width, 100px);
    --tsg-nesting-indent-final: var(--tsg-nesting-indent, 20px);

    --tsg-background-color-final: var(--tsg-background-color, white);
    --tsg-foreground-color-final: var(--tsg-foreground-color, black);
    --tsg-separator-color-final: var(--tsg-separator-color, dimgray);
    --tsg-header-color-final: var(--tsg-header-color, ghostwhite);
    --tsg-border-color-final: var(--tsg-border-color, lightgray);
    --tsg-symbol-color-final: var(--tsg-symbol-color, dimgray);
    --tsg-selection-color-final: var(--tsg-selection-color, ghostwhite);

    --tsg-not-started-fg-color-final: var(--tsg-not-started-fg-color, dimgray);
    --tsg-in-progress-fg-color-final: var(--tsg-in-progress-fg-color, black);
    --tsg-overdue-fg-color-final: var(--tsg-overdue-fg-color, darkred);
    --tsg-completed-fg-color-final: var(--tsg-completed-fg-color, darkgreen);
    --tsg-completed-late-fg-color-final: var(--tsg-completed-late-fg-color, sienna);

    --tsg-today-line-color-final: var(--tsg-today-line-color, orangered);
    --tsg-chart-bar-color-1-final: var(--tsg-chart-bar-color-1, skyblue);
    --tsg-chart-bar-color-2-final: var(--tsg-chart-bar-color-2, lightcoral);
    --tsg-chart-bar-accent-1-final: var(--tsg-chart-bar-accent-1, darkcyan);
    --tsg-chart-bar-accent-2-final: var(--tsg-chart-bar-accent-2, darkred);

    --tsg-font-family-final: var(--tsg-font-family, 'Calibri', sans-serif);
    --tsg-font-size-final: var(--tsg-font-size, 14px);
    --tsg-line-height-final: var(--tsg-line-height, 16px);
    --tsg-max-cell-text-lines-final: var(--tsg-max-cell-text-lines, 2);
  }

  .tsg-no-text-selection {  
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tsg-wrapper {  
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--tsg-background-color-final);
  }

  .tsg-wrapper * {
    box-sizing: border-box;
  }

  .tsg-separator {
    display: flex;
    flex: 0 0 auto;
    width: var(--tsg-separator-width);
    height: 100%;
    padding: 0;
    cursor: ew-resize;
    background-color: var(--tsg-separator-color-final);
  }

  .tsg-table-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(50% - 5px);
    height: 100%;
    min-width: var(--tsg-table-min-width-final);
    overflow-y: auto;
    overflow-x: scroll;
  }

  .tsg-table {
    width: 100%;
    border-spacing: 0;
    font-family: var(--tsg-font-family-final);
    color: var(--tsg-foreground-color-final);
    table-layout: fixed;
  }

  .tsg-table-header {
    position: sticky;
    top: 0;
    padding: 5px;
    height: var(--tsg-header-height) !important;
    font-size: var(--tsg-font-size-final);
    border-width: 0 var(--tsg-gridlines-width) var(--tsg-gridlines-width) 0;
    border-color: var(--tsg-border-color-final);
    border-style: solid;
    background-color: var(--tsg-header-color-final);
    z-index: 5;
  }
  .tsg-table-col-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }

  .tsg-table-body-row {
    height: var(--tsg-row-height) !important;
  }
  .tsg-table-body-row.selected {
    background-color: var(--tsg-selection-color-final);
  }
  .selected .tsg-table-body-cell {
    font-weight: bold;
  }
  .not-started .tsg-table-body-cell {
    color: var(--tsg-not-started-fg-color-final);
  }
  .in-progress .tsg-table-body-cell {
    color: var(--tsg-in-progress-fg-color-final);
  }
  .overdue .tsg-table-body-cell {
    color: var(--tsg-overdue-fg-color-final);
  }
  .completed .tsg-table-body-cell {
    color: var(--tsg-completed-fg-color-final);
  }
  .completed-late .tsg-table-body-cell {
    color: var(--tsg-completed-late-fg-color-final);
  }

  .tsg-table-body-cell {
    padding: 0;
    cursor: default;
    border-width: 0 var(--tsg-gridlines-width) var(--tsg-gridlines-width) 0;
    border-color: var(--tsg-border-color-final);
    border-style: solid;
  }

  .tsg-table-body-cell-text-wrapper {
    display: flex;
    align-items: center;
    height: calc(var(--tsg-row-height) - 2px);
    padding: 2px;
  }
  .tsg-table-body-cell-text-wrapper.start {
    justify-content: flex-start;
  }
  .tsg-table-body-cell-text-wrapper.center {
    justify-content: center;
  }
  .tsg-table-body-cell-text-wrapper.end {
    justify-content: flex-end;
  }

  .tsg-table-body-cell-text-expander {
    width: var(--tsg-nesting-indent-final) !important;
    min-width: var(--tsg-nesting-indent-final) !important;
    color: var(--tsg-symbol-color-final);
    text-align: center;
    cursor: pointer;
  }
  .tsg-table-body-cell-text-expander.nesting-1 {
    padding-left: var(--tsg-nesting-indent-final) !important;
    width: calc(var(--tsg-nesting-indent-final) * 2) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 2) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-2 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 2) !important;
    width: calc(var(--tsg-nesting-indent-final) * 3) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 3) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-3 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 3) !important;
    width: calc(var(--tsg-nesting-indent-final) * 4) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 4) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-4 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 4) !important;
    width: calc(var(--tsg-nesting-indent-final) * 5) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 5) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-5 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 5) !important;
    width: calc(var(--tsg-nesting-indent-final) * 6) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 6) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-6 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 6) !important;
    width: calc(var(--tsg-nesting-indent-final) * 7) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 7) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-7 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 7) !important;
    width: calc(var(--tsg-nesting-indent-final) * 8) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 8) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-8 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 8) !important;
    width: calc(var(--tsg-nesting-indent-final) * 9) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 9) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-9 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 9) !important;
    width: calc(var(--tsg-nesting-indent-final) * 10) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 10) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-max {
    padding-left: calc(var(--tsg-nesting-indent-final) * 10) !important;
    width: calc(var(--tsg-nesting-indent-final) * 11) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 11) !important;
  }

  .tsg-table-body-cell-text {
    position: relative;
    overflow: hidden;
    max-height: calc(var(--tsg-max-cell-text-lines-final) * var(--tsg-line-height-final));
    font-size: var(--tsg-font-size-final);
    line-height: var(--tsg-line-height-final);
    display: -webkit-box;
    -webkit-line-clamp: var(--tsg-max-cell-text-lines-final);
    -webkit-box-orient: vertical;
  }

  .tsg-chart-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    min-width: var(--tsg-chart-min-width-final);
    overflow-y: auto;
    overflow-x: scroll;
  }

  .tsg-chart {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .tsg-chart-header {
    position: sticky;
    top: 0;
  }

  .tsg-chart-header-bg {
    fill: var(--tsg-header-color-final);
    stroke-width: var(--tsg-gridlines-width);
    stroke: var(--tsg-border-color-final);
  }

  .tsg-chart-header-text {
    font-family: var(--tsg-font-family-final);
    font-size: var(--tsg-font-size-final);
    font-weight: bold;
  }

  .tsg-chart-header-gl,
  .tsg-chart-body-gl {
    stroke-width: var(--tsg-gridlines-width);
    stroke: var(--tsg-border-color-final);
    shape-rendering: crispEdges;
  }
  .tsg-chart-body-gl-today {
    stroke-width: calc(var(--tsg-gridlines-width) + 2px);
    stroke: var(--tsg-today-line-color-final);
  }

  .tsg-chart-body-bg {
    fill: transparent;
  }

  .tsg-chart-row-bg {
    fill: var(--tsg-background-color-final);
  }
  .tsg-chart-row-bg.selected {
    fill: var(--tsg-selection-color-final);
  }

  .tsg-chart-row {
    fill: transparent;
  }

  .tsg-chart-bar-planned {
    fill: var(--tsg-chart-bar-color-1-final);
    stroke: var(--tsg-chart-bar-color-1-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }
  .selected .tsg-chart-bar-planned {
    stroke: var(--tsg-chart-bar-accent-1-final);
  }
  .tsg-chart-bar-planned-progress {
    fill: var(--tsg-chart-bar-accent-1-final);
    stroke: var(--tsg-chart-bar-accent-1-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }

  .tsg-chart-bar-actual {
    fill: var(--tsg-chart-bar-color-2-final);
    stroke: var(--tsg-chart-bar-color-2-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }
  .selected .tsg-chart-bar-actual {
    stroke: var(--tsg-chart-bar-accent-2-final);
  }
  .tsg-chart-bar-actual-progress {
    fill: var(--tsg-chart-bar-accent-2-final);
    stroke: var(--tsg-chart-bar-accent-2-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }
</style>
`;
