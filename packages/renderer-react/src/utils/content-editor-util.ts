export function selectTo(
  div: HTMLElement,
  sel: Selection,
  dir: 'start' | 'end'
) {
  sel = sel || window.getSelection();
  const anchorNode = sel.anchorNode;
  if (div.contains(anchorNode)) {
    const anchorOffset = sel.anchorOffset;
    const range = new Range();
    if (dir === 'end') {
      range.setStart(anchorNode, anchorOffset);
      range.setEndAfter(div.lastChild);
    } else {
      range.setStartBefore(div.firstChild);
      range.setEnd(anchorNode, anchorOffset);
    }
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

export function selectToEnd(div: HTMLElement, sel: Selection) {
  selectTo(div, sel, 'end');
}

export function selectToStart(div: HTMLElement, sel: Selection) {
  selectTo(div, sel, 'start');
}
