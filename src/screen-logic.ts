import { mapButBetter } from './array-helpers';
import { Direction, getDirectionFromTo, Position } from './game-logic';
import { DeepReadonlyArray } from './store/types/readonly-types';

export function mapEventKeyToDirection(eventKey: string): Direction | null {
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
export function mapDirectionToBorderProp(direction: Direction): 'bottom' | 'top' | 'right' | 'left' {
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

export function calculateModifierY(
  windowInnerHeight: number,
  boundaries: { maxYPos: number, minYPos: number }
): number {
  return windowInnerHeight / (boundaries.maxYPos - boundaries.minYPos);
}

export function calculateModifierX(
  windowInnerWidth: number,
  boundaries: { maxXPos: number, minXPos: number }
): number {
  return windowInnerWidth / (boundaries.maxXPos - boundaries.minXPos);
}

export function mapFoodTo(payload: {
  fragment: Position,
  modifiers: {
    pxModifierX: number,
    pxModifierY: number
  }
}): {
  xPosInPx: string,
  yPosInPx: string,
  widthInPx: string,
  heightInPx: string
} {
  const { fragment, modifiers } = payload;

  return {
    xPosInPx: fragment.xPos * modifiers.pxModifierX + 'px',
    yPosInPx: fragment.yPos * modifiers.pxModifierY + 'px',
    widthInPx: 1 * modifiers.pxModifierX + 'px',
    heightInPx: 1 * modifiers.pxModifierY + 'px',
  };
}

export function mapFragmentTo(payload: {
  fragment: Position & {prevDirection: Direction | null, nextDirection: Direction | null},
  modifiers: {
    pxModifierX: number,
    pxModifierY: number
  }
}): {
  xPosInPx: string,
  yPosInPx: string,
  widthInPx: string,
  heightInPx: string,
  prevDirection: Direction | null,
  nextDirection: Direction | null
} {
  const { fragment, modifiers } = payload;

  return {
    xPosInPx: fragment.xPos * modifiers.pxModifierX + 'px',
    yPosInPx: fragment.yPos * modifiers.pxModifierY + 'px',
    widthInPx: 1 * modifiers.pxModifierX + 'px',
    heightInPx: 1 * modifiers.pxModifierY + 'px',
    prevDirection: fragment.prevDirection,
    nextDirection: fragment.nextDirection,
  };
}

type PositionWithDirections = Position & { prevDirection: Direction | null, nextDirection: Direction | null };

function updateTailFragment(payload: { current: Position, next: Position }): PositionWithDirections {
  const { current: tailFragment, next: nextFragment } = payload;

  const snakeViewFragment = {
    ...tailFragment,
    prevDirection: null,
    nextDirection: getDirectionFromTo({
      firstFragment: tailFragment,
      secondFragment: nextFragment
    }),
  };

  return snakeViewFragment;
}

function updateMiddleFragment(payload: { previous: Position, current: Position, next: Position }): PositionWithDirections {
  const { previous: previousFragment, current: currentFragment, next: nextFragment } = payload;

  const snakeViewFragment = {
    ...currentFragment,
    prevDirection: getDirectionFromTo({
      firstFragment: currentFragment,
      secondFragment: previousFragment
    }),
    nextDirection: getDirectionFromTo({
      firstFragment: currentFragment,
      secondFragment: nextFragment
    }),
  };

  return snakeViewFragment;
}

function updateHeadFragment(payload: { previous: Position, current: Position }): PositionWithDirections {
  const { previous: previousFragment, current: headFragment } = payload;

  const snakeViewFragment = {
    ...headFragment,
    prevDirection: getDirectionFromTo({
      firstFragment: headFragment,
      secondFragment: previousFragment
    }),
    nextDirection: null,
  };

  return snakeViewFragment;
}

export function buildSnakeViewFragments(
  modifiers: { pxModifierX: number, pxModifierY: number },
  snakeFragmentPositions: DeepReadonlyArray<Position>
) {
  const snakeFragmentPositionsWithDirections = mapButBetter(snakeFragmentPositions, {
    firstEntryCallback: updateTailFragment,
    middleEntryCallback: updateMiddleFragment,
    lastEntryCallback: updateHeadFragment
  });

  const snakeViewFragments = snakeFragmentPositionsWithDirections.map(fragment => mapFragmentTo({
    fragment: fragment,
    modifiers: modifiers
  }));
  return snakeViewFragments;
}
