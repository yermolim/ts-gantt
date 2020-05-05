// Generated by dts-bundle-generator v4.3.0

import dayjs from 'dayjs';

export declare class TsGanttTask {
	readonly externalId: string;
	readonly uuid: string;
	parentExternalId: string;
	parentUuid: string;
	nestingLvl: number;
	hasChildren: boolean;
	name: string;
	localizedNames: {
		[key: string]: string;
	};
	datePlannedStart: dayjs.Dayjs | null;
	datePlannedEnd: dayjs.Dayjs | null;
	dateActualStart: dayjs.Dayjs | null;
	dateActualEnd: dayjs.Dayjs | null;
	shown: boolean;
	expanded: boolean;
	private _progress;
	set progress(value: number);
	get progress(): number;
	constructor(id: string, parentId: string, name: string, localizedNames: {
		[key: string]: string;
	}, progress: number, datePlannedStart?: Date | null, datePlannedEnd?: Date | null, dateActualStart?: Date | null, dateActualEnd?: Date | null, nestingLvl?: number, hasChildren?: boolean, parentUuid?: string, uuid?: string);
	static convertModelsToTasks(taskModels: TsGanttTaskModel[], idsMap?: Map<string, string>): TsGanttTask[];
	static convertTasksToModels(tasks: TsGanttTask[]): TsGanttTaskModel[];
	static detectTaskChanges(data: TsGanttTaskUpdateResult): TsGanttTaskChangeResult;
	static getTasksIdsMap(tasks: TsGanttTask[]): Map<string, string>;
	static checkPaternity(tasks: TsGanttTask[], parent: TsGanttTask, child: TsGanttTask): boolean;
	static sortTasksRecursively(tasks: TsGanttTask[], parentUuid: string): TsGanttTask[];
	equals(another: TsGanttTask): boolean;
	compareTo(another: TsGanttTask): number;
}
export interface TsGanttTaskModel {
	id: string;
	parentId: string;
	name: string;
	progress: number;
	datePlannedStart: Date;
	datePlannedEnd: Date;
	dateActualStart: Date;
	dateActualEnd: Date;
	localizedNames: {
		[key: string]: string;
	};
}
export interface TsGanttTaskUpdateResult {
	oldTasks: TsGanttTask[];
	newTasks: TsGanttTask[];
}
export interface TsGanttTaskChangeResult {
	added: TsGanttTask[];
	deleted: TsGanttTask[];
	changed: TsGanttTask[];
	all: TsGanttTask[];
}
export declare class TsGanttOptions {
	enableChartEdit: boolean;
	enablePlannedDatesEdit: boolean;
	enableActualDatesEdit: boolean;
	bindParentDatesToChild: boolean;
	enableProgressEdit: boolean;
	columnsMinWidthPx: number[];
	columnsContentAlign: ("start" | "center" | "end")[];
	separatorWidthPx: number;
	headerHeightPx: number;
	rowHeightPx: number;
	borderWidthPx: number;
	barStrokeWidthPx: number;
	barMarginPx: number;
	barCornerRadiusPx: number;
	rowSymbols: TsGanttRowSymbols;
	chartShowProgress: boolean;
	chartDisplayMode: "planned" | "actual" | "both";
	chartScale: "day" | "week" | "month" | "year";
	chartDateOffsetDays: {
		[key: string]: number;
	};
	chartDateOffsetDaysMin: {
		[key: string]: number;
	};
	chartDayWidthPx: {
		[key: string]: number;
	};
	locale: string;
	localeDecimalSeparator: {
		[key: string]: string;
	};
	localeDateFormat: {
		[key: string]: string;
	};
	localeFirstWeekDay: {
		[key: string]: number;
	};
	localeDateMonths: {
		[key: string]: string[];
	};
	localeDateDays: {
		[key: string]: string[];
	};
	localeDateDaysShort: {
		[key: string]: string[];
	};
	localeDateScale: {
		[key: string]: string[];
	};
	localeFooters: {
		[key: string]: string[];
	};
	localeHeaders: {
		[key: string]: string[];
	};
	localeDurationFormatters: {
		[key: string]: (duration: number) => string;
	};
	columnValueGetters: ((a: TsGanttTask) => string)[];
	constructor(item?: object);
}
export interface TsGanttRowSymbols {
	expanded: string;
	collapsed: string;
	childless: string;
}
export declare class TsGantt {
	private _options;
	private _tasks;
	get tasks(): TsGanttTaskModel[];
	set tasks(models: TsGanttTaskModel[]);
	private _selectedTask;
	get selectedTask(): TsGanttTaskModel;
	set selectedTask(model: TsGanttTaskModel);
	private _htmlContainer;
	private _htmlWrapper;
	private _htmlTableWrapper;
	private _htmlChartWrapper;
	private _htmlSeparator;
	private _htmlSeparatorDragActive;
	private _table;
	private _chart;
	private _ignoreNextScrollEvent;
	set locale(value: string);
	set chartScale(value: "day" | "week" | "month" | "year");
	set chartDisplayMode(value: "planned" | "actual" | "both");
	constructor(containerSelector: string, options: TsGanttOptions);
	destroy(): void;
	onResize: (e: Event) => void;
	onMouseDownOnSep: (e: MouseEvent) => void;
	onMouseMoveOnSep: (e: MouseEvent) => boolean;
	onMouseUpOnSep: (e: MouseEvent) => void;
	onWrapperScroll: EventListener;
	onRowClick: EventListener;
	onRowExpanderClick: EventListener;
	private removeResizeEventListeners;
	private removeRowEventListeners;
	private setCssVariables;
	private createLayout;
	private updateTasks;
	private toggleTaskExpanded;
	private selectTask;
	scrollChartToTask(uuid: string): void;
	private update;
	private updateLocale;
	private updateChartScale;
	private updateChartDisplayMode;
	private refreshSelection;
}

export {};
