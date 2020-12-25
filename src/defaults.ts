import { Boundaries, Direction } from './game-logic';

// todo make everything readonly

export const initialDirection: Direction = 'right';

const initialColor = 'white';

export const initialBoundaries: Boundaries = {
  minXPos: 0,
  maxXPos: 19,
  minYPos: 0,
  maxYPos: 19,
};
export function initialSnake() {
  return [
    { xPos: 0, yPos: 0, color: initialColor },
    { xPos: 1, yPos: 0, color: initialColor },
    { xPos: 2, yPos: 0, color: initialColor },
    { xPos: 3, yPos: 0, color: initialColor },
  ];
}
