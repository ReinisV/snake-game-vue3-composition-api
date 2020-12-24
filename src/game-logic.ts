export type Position = { xPos: number; yPos: number }
export type Direction = 'left' | 'right' | 'up' | 'down';

export type SnakeFragment = {
  color: string;
} & Position;

export type Game = {
  snakeFragmentPositions: SnakeFragment[];
  currentDirection: Direction;
  nextDirection: Direction;
  nextMoveSpeed: number;

  foodPosition: {
    xPos: number;
    yPos: number;
    color: string;
  };
};

export type Boundaries = {
  minXPos: number;
  maxXPos: number;
  minYPos: number;
  maxYPos: number;
}

export function calculateNextPos (
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

export function directionsAreOpposite (
  inputtedDirection: Direction,
  currentDirection: Direction
): boolean {
  if (inputtedDirection === oppositeDirections[currentDirection]) {
    return true;
  }

  return false;
}

export function randomFood (payload: { maxXPos: number; maxYPos: number }): {
  xPos: number;
  yPos: number;
  color: string;
} {
  return {
    xPos: Math.floor(Math.random() * payload.maxXPos),
    yPos: Math.floor(Math.random() * payload.maxYPos),
    color: 'red'
  };
}

export function updatePositions (
  game: Game,
  boundaries: Boundaries,
  restartGame: () => void
): void {
  const oldHeadPos = game.snakeFragmentPositions[game.snakeFragmentPositions.length - 1];
  const newHeadPos = calculateNextPos(game.nextDirection, oldHeadPos, boundaries, game.nextMoveSpeed);

  if (newHeadPos.xPos === game.foodPosition.xPos &&
    newHeadPos.yPos === game.foodPosition.yPos) {
    game.foodPosition = randomFood(boundaries);
  } else {
    const crash = game.snakeFragmentPositions.some(fragmentPos =>
      fragmentPos.xPos === newHeadPos.xPos &&
      fragmentPos.yPos === newHeadPos.yPos);
    if (crash) {
      restartGame();
      return;
    }
    game.snakeFragmentPositions.shift();
  }

  game.snakeFragmentPositions.push({
    ...newHeadPos,
    color: oldHeadPos.color
  });

  game.currentDirection = game.nextDirection;
}
