export function paddingCss(arg: {
  top: number;
  right: number;
  bottom: number;
  left: number;
}) {
  const { top = 0, right = 0, bottom = 0, left = 0 } = arg;
  return `${top}px ${right}px ${bottom}px ${left}px`;
}

export function getComputedStyle(element: Element, property: string) {
  return window.getComputedStyle(element, null).getPropertyValue(property);
}
