// Generated by dts-bundle-generator v4.0.0

export declare class TsGanttTask {
	uuid: string;
	parentUuid: string;
	id: any;
	name: string;
	datePlannedStart: Date;
	datePlannedEnd: Date;
	durationPlanned: number;
	dateActualStart: Date | null;
	dateActualEnd: Date | null;
	durationActual: number;
	children: TsGanttTask[];
	private _progress;
	set progress(value: number);
	get progress(): number;
	constructor(name: string, progress: number, datePlannedStart: Date, datePlannedEnd: Date, dateActualStart?: Date | null, dateActualEnd?: Date | null, children?: TsGanttTask[]);
	static flatten(tree: TsGanttTask[]): TsGanttTask[];
	refreshDuration(): void;
}
export declare class TsGanttOptions {
	headerHeight: number;
	rowHeight: number;
	columnWidth: number;
	scale: "hour" | "day" | "week" | "month";
	locale: "ru" | "en" | "uk";
	customDateFormat: string;
	allowMoveBars: boolean;
	allowResizeBars: boolean;
	allowMoveProgress: boolean;
	constructor(item?: object);
	barHeaderGetter: (a: TsGanttTask) => string;
	tooltipHeaderGetter: (a: TsGanttTask) => string;
	tooltipPlannedPeriodGetter: (a: TsGanttTask) => string;
	tooltipActualPeriodGetter: (a: TsGanttTask) => string;
	tooltipPlannedDurationGetter: (a: TsGanttTask) => number;
	tooltipActualDurationGetter: (a: TsGanttTask) => number;
	tooltipProgressGetter: (a: TsGanttTask) => number;
}
export declare class TsGantt {
	private static readonly WRAPPER_CLASS;
	private static readonly GRID_CLASS;
	private static readonly SVG_CLASS;
	private static readonly SEPARATOR_CLASS;
	private static readonly GRID_MIN_WIDTH;
	private _options;
	private _tasks;
	private _chartColumns;
	private _chartRows;
	private _tableColumns;
	private _tableRows;
	private _container;
	private _wrapper;
	private _table;
	private _chartSvg;
	private _separator;
	private _isSeparatorDragActive;
	constructor(containerSelector: string, options: TsGanttOptions);
	destroy(): void;
	createLayout(): void;
	clearTasks(): void;
	pushTasks(tasks: TsGanttTask[]): void;
	onMouseDownOnSep: (e: MouseEvent) => void;
	onMouseMoveOnSep: (e: MouseEvent) => boolean;
	onMouseUpOnSep: (e: MouseEvent) => void;
}

export {};
