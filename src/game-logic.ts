import { forEachButBetter } from './array-helpers';
import { initialBoundaries, initialDirection, initialSnake } from './defaults';

export type Position = { xPos: number, yPos: number }
export type Direction = 'left' | 'right' | 'up' | 'down';

export type SnakeFragment = {
  color: string
} & Position;

export type Game = {
  boundaries: Boundaries,
  currentDirection: Direction,
  nextDirection: Direction,
  nextMoveSpeed: number,
  points: number,

  snakeFragmentPositions: SnakeFragment[],

  foodPosition: {
    xPos: number,
    yPos: number,
    color: string
  }
};

export type Boundaries = {
  minXPos: number,
  maxXPos: number,
  minYPos: number,
  maxYPos: number
}

export function buildGame(): Game {
  return {
    boundaries: {
      ...initialBoundaries
    },
    currentDirection: initialDirection,
    nextDirection: initialDirection,
    nextMoveSpeed: 1,
    points: 0,

    snakeFragmentPositions: initialSnake(),

    foodPosition: buildFood(initialBoundaries)
  };
};

export const gameLogic = {
  updateSnakeDirection(
    game: Game,
    inputtedDirection: Direction | null
  ): void {
    if (inputtedDirection === null) {
      return;
    }

    if (directionsAreOpposite(inputtedDirection, game.currentDirection)) {
      return;
    }

    game.nextDirection = inputtedDirection;
  },

  moveForward(
    game: Game,
    boundaries: Boundaries,
    restartGame: () => void
  ): void {
    const oldTailPosition = {
      ...game.snakeFragmentPositions[0]
    };

    moveEachPositionForward(game.snakeFragmentPositions, game.nextDirection, boundaries);

    const newHeadPosition = game.snakeFragmentPositions[game.snakeFragmentPositions.length - 1];
    const nonHeadPositions = game.snakeFragmentPositions.slice(0, game.snakeFragmentPositions.length - 1);

    if (newHeadPosition.xPos === game.foodPosition.xPos &&
      newHeadPosition.yPos === game.foodPosition.yPos) {
      // food collected
      game.foodPosition = buildFood(boundaries);
      game.snakeFragmentPositions.unshift(oldTailPosition);
      game.points += 1;
    } else {
      const crash = nonHeadPositions.some(fragmentPos =>
        fragmentPos.xPos === newHeadPosition.xPos &&
        fragmentPos.yPos === newHeadPosition.yPos);
      if (crash) {
        restartGame();
        return;
      }
    }

    game.currentDirection = game.nextDirection;
  }
};

export function calculateNextPos(
  nextDirection: Direction,
  previousPos: Position,
  boundaries: Boundaries,
  posIncrease: number
): Position {
  const newPos = {
    xPos: previousPos.xPos,
    yPos: previousPos.yPos
  };

  if (nextDirection === 'left') {
    newPos.xPos = previousPos.xPos - posIncrease;
  } else if (nextDirection === 'right') {
    newPos.xPos = previousPos.xPos + posIncrease;
  } else if (nextDirection === 'down') {
    newPos.yPos = previousPos.yPos + posIncrease;
  } else if (nextDirection === 'up') {
    newPos.yPos = previousPos.yPos - posIncrease;
  }

  if (newPos.xPos < boundaries.minXPos) {
    newPos.xPos = boundaries.maxXPos;
  } else if (newPos.xPos >= boundaries.maxXPos) {
    newPos.xPos = boundaries.minXPos;
  }

  if (newPos.yPos < boundaries.minYPos) {
    newPos.yPos = boundaries.maxYPos;
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

export function getDirectionFromTo(
  firstFragment: SnakeFragment,
  secondFragment: SnakeFragment
): Direction {
  if (firstFragment.xPos === secondFragment.xPos) {
    if (firstFragment.yPos > secondFragment.yPos) {
      return 'up';
    }
    if (firstFragment.yPos < secondFragment.yPos) {
      return 'down';
    }
    throw new Error();
  }
  if (firstFragment.yPos === secondFragment.yPos) {
    if (firstFragment.xPos > secondFragment.xPos) {
      return 'left';
    }
    if (firstFragment.xPos < secondFragment.xPos) {
      return 'right';
    }
    throw new Error();
  }
  throw new Error();
}

export function randomPosition(
  payload: { maxXPos: number, maxYPos: number }
): Position {
  return {
    xPos: Math.floor(Math.random() * payload.maxXPos),
    yPos: Math.floor(Math.random() * payload.maxYPos)
  };
}

export function buildFood(boundaries: Boundaries): SnakeFragment {
  return {
    ...randomPosition(boundaries),
    color: 'red'
  };
}

function moveEachPositionForward(
  snakeFragmentPositions: SnakeFragment[],
  nextDirection: Direction,
  boundaries: Boundaries
): void {
  forEachButBetter(snakeFragmentPositions, {
    middleEntryCallback: (payload) => {
      const { current: fragment, next: nextFragment } = payload;

      fragment.xPos = nextFragment.xPos;
      fragment.yPos = nextFragment.yPos;
    },
    lastEntryCallback: (payload) => {
      const { current: fragment } = payload;

      const fragmentNewHeadPos = calculateNextPos(nextDirection, fragment, boundaries, 1);
      fragment.xPos = fragmentNewHeadPos.xPos;
      fragment.yPos = fragmentNewHeadPos.yPos;
    },
  });
}
