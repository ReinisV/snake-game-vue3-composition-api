export type Position = { xPos: number, yPos: number }
export type Direction = 'left' | 'right' | 'up' | 'down';

export type Boundaries = {
  minXPos: number,
  maxXPos: number,
  minYPos: number,
  maxYPos: number
}

export function calculateNextPos(
  nextDirection: Direction,
  previousPos: Position,
  boundaries: Boundaries
): Position {
  const newPos = {
    xPos: previousPos.xPos,
    yPos: previousPos.yPos
  };

  if (nextDirection === 'left') {
    newPos.xPos = previousPos.xPos - 1;
  } else if (nextDirection === 'right') {
    newPos.xPos = previousPos.xPos + 1;
  } else if (nextDirection === 'down') {
    newPos.yPos = previousPos.yPos + 1;
  } else if (nextDirection === 'up') {
    newPos.yPos = previousPos.yPos - 1;
  }

  if (newPos.xPos < boundaries.minXPos) {
    newPos.xPos = boundaries.maxXPos - 1;
  } else if (newPos.xPos >= boundaries.maxXPos) {
    newPos.xPos = boundaries.minXPos;
  }

  if (newPos.yPos < boundaries.minYPos) {
    newPos.yPos = boundaries.maxYPos - 1;
  } else if (newPos.yPos >= boundaries.maxYPos) {
    newPos.yPos = boundaries.minYPos;
  }

  return newPos;
};

const oppositeDirections: { [direction in Direction]: Direction } = {
  left: 'right',
  right: 'left',
  up: 'down',
  down: 'up'
};

export function directionsAreOpposite(
  inputtedDirection: Direction,
  currentDirection: Direction
): boolean {
  if (inputtedDirection === oppositeDirections[currentDirection]) {
    return true;
  }

  return false;
}

export function getOppositeDirection(
  direction: Direction
): Direction {
  return oppositeDirections[direction];
}

export function isVerticalDirection(
  direction: Direction
): boolean {
  if (direction === 'up' || direction === 'down') {
    return true;
  }

  return false;
}

export function directionsAreNextToEachOther(
  firstDirection: Direction,
  secondDirection: Direction
): boolean {
  const firstIsVertical = isVerticalDirection(firstDirection);
  const secondIsVertical = isVerticalDirection(secondDirection);
  return firstIsVertical !== secondIsVertical;
}

export function getDirectionFromTo(payload: {
  firstFragment: Position,
  secondFragment: Position
}): Direction {
  const { firstFragment, secondFragment } = payload;

  if (firstFragment.xPos === secondFragment.xPos) {
    if (firstFragment.yPos > secondFragment.yPos) {
      return 'up';
    }
    if (firstFragment.yPos < secondFragment.yPos) {
      return 'down';
    }
    throw new Error('crash state1:\n' + JSON.stringify(payload, undefined, 2));
  }
  if (firstFragment.yPos === secondFragment.yPos) {
    if (firstFragment.xPos > secondFragment.xPos) {
      return 'left';
    }
    if (firstFragment.xPos < secondFragment.xPos) {
      return 'right';
    }
    throw new Error('crash state2:\n' + JSON.stringify(payload, undefined, 2));
  }

  throw new Error('crash state3:\n' + JSON.stringify(payload, undefined, 2));
}

export function randomPosition(
  boundaries: Boundaries,
  exclude: Position[],
): Position {
  const { maxXPos, minXPos, maxYPos, minYPos } = boundaries;

  // todo write this better,
  // 1) get areas of all possible values that are within boundaries
  // but are not the exclude values
  // 2) get random values for each of the areas
  // 3) randomly choose a value from one of the areas (use weights
  // based on how big the areas were)
  return notInArray(() => ({
    xPos: Math.floor(Math.random() * maxXPos) - minXPos,
    yPos: Math.floor(Math.random() * maxYPos) - minYPos
  }),
  (first, second) => { return first.xPos === second.xPos && first.yPos === second.yPos; },
  exclude);
}

function notInArray<T>(
  getValue: () => T,
  isEqual: (first: T, second: T) => boolean,
  exclude: T[]
): T {
  while (true) {
    const result = getValue();
    const anyEquals = exclude.some(ex => isEqual(result, ex));
    if (!anyEquals) {
      return result;
    }
  }
}
