import dayjs from "dayjs";

function getRandomUuid(): string {
  return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

function createSvgElement(elementTag: string, 
  classList: string[] = [],
  attributes: [string, string][] = [], 
  parent: Element = null,
  innerHtml: string = null): SVGElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", elementTag);
  for (const attribute of attributes) {
    element.setAttribute(attribute[0], attribute[1]);
  }
  if (classList.length !== 0) {
    element.classList.add(...classList);
  }
  if (innerHtml) {
    element.innerHTML = innerHtml;
  }
  if (parent) {
    parent.append(element);
  }
  return element;
}

function getAllDatesBetweenTwoDates(start: dayjs.Dayjs, end: dayjs.Dayjs): dayjs.Dayjs[] {
  const dateStart = start.startOf("day");
  const dateEnd = end.startOf("day");  
  if (!dateStart || !dateEnd || dateEnd.diff(dateStart) < 0) {
    return [];
  } 
  if (dateEnd.diff(dateStart) === 0) {
    return [dateStart];
  }

  const dates: dayjs.Dayjs[] = [];
  let currentDate = dateStart;
  while (currentDate.isBefore(dateEnd) || currentDate.isSame(dateEnd)) {
    dates.push(currentDate);
    currentDate = currentDate.add(1, "day");
  }
  return dates;
}

export { getRandomUuid, createSvgElement, getAllDatesBetweenTwoDates };
