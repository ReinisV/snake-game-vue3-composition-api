import { Direction, SnakeFragment } from './game-logic';

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
export function mapDirectionToBorderProp (direction: Direction): 'bottom' | 'top' | 'right' | 'left' {
  if (direction === 'right') {
    return 'right';
  }
  if (direction === 'left') {
    return 'left';
  }
  if (direction === 'up') {
    return 'top';
  }
  if (direction === 'down') {
    return 'bottom';
  }

  throw new Error();
}

export function calculateModifierY (
  windowInnerHeight: number,
  boundaries: { maxYPos: number, minYPos: number }
): number {
  return windowInnerHeight / (boundaries.maxYPos - boundaries.minYPos);
}

export function calculateModifierX (
  windowInnerWidth: number,
  boundaries: { maxXPos: number, minXPos: number }
): number {
  return windowInnerWidth / (boundaries.maxXPos - boundaries.minXPos);
}

export function mapFoodTo (payload: {
  fragment: SnakeFragment,
  modifiers: {
    pxModifierX: number,
    pxModifierY: number
  }
}): {
  xPosInPx: string,
  yPosInPx: string,
  widthInPx: string,
  heightInPx: string,
  color: string
} {
  const { fragment, modifiers } = payload;

  return {
    xPosInPx: fragment.xPos * modifiers.pxModifierX + 'px',
    yPosInPx: fragment.yPos * modifiers.pxModifierY + 'px',
    widthInPx: 1 * modifiers.pxModifierX + 'px',
    heightInPx: 1 * modifiers.pxModifierY + 'px',
    color: fragment.color,
  };
}

export function mapFragmentTo (payload: {
  fragment: SnakeFragment & {prevDirection: Direction | null, nextDirection: Direction | null},
  modifiers: {
    pxModifierX: number,
    pxModifierY: number
  }
}): {
  xPosInPx: string,
  yPosInPx: string,
  widthInPx: string,
  heightInPx: string,
  color: string,
  prevDirection: Direction | null,
  nextDirection: Direction | null
} {
  const { fragment, modifiers } = payload;

  return {
    xPosInPx: fragment.xPos * modifiers.pxModifierX + 'px',
    yPosInPx: fragment.yPos * modifiers.pxModifierY + 'px',
    widthInPx: 1 * modifiers.pxModifierX + 'px',
    heightInPx: 1 * modifiers.pxModifierY + 'px',
    color: fragment.color,
    prevDirection: fragment.prevDirection,
    nextDirection: fragment.nextDirection,
  };
}
