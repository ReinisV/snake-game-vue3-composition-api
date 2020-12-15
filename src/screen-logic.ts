import { Direction } from './game-logic';

export function mapEventKeyToDirection (eventKey: string): Direction | null {
  if (eventKey === 'ArrowLeft') {
    return 'left';
  }
  if (eventKey === 'ArrowRight') {
    return 'right';
  }
  if (eventKey === 'ArrowDown') {
    return 'down';
  }
  if (eventKey === 'ArrowUp') {
    return 'up';
  }
  return null;
}

export function calculateModifierY (
  windowInnerHeight: number,
  boundaries: { maxYPos: number; minYPos: number }
): number {
  return windowInnerHeight / (boundaries.maxYPos - boundaries.minYPos);
}

export function calculateModifierX (
  windowInnerWidth: number,
  boundaries: { maxXPos: number; minXPos: number }
): number {
  return windowInnerWidth / (boundaries.maxXPos - boundaries.minXPos);
}

export function mapFragmentTo (
  fragment: { xPos: number; yPos: number; color: string },
  modifiers: {
    pxModifierX: number;
    pxModifierY: number;
  }
): {
  xPosInPx: string;
  yPosInPx: string;
  widthInPx: string;
  heightInPx: string;
  color: string;
} {
  return {
    xPosInPx: fragment.xPos * modifiers.pxModifierX + 'px',
    yPosInPx: fragment.yPos * modifiers.pxModifierY + 'px',
    widthInPx: 1 * modifiers.pxModifierX + 'px',
    heightInPx: 1 * modifiers.pxModifierY + 'px',
    color: fragment.color
  };
}
