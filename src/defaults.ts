import { Boundaries, Direction, Position } from './game-logic';
import { DeepReadonly } from './store/types/readonly-types';

export const initialDirection: Direction = 'right';

export const initialBoundaries: DeepReadonly<Boundaries> = {
  minXPos: 0,
  maxXPos: 9,
  minYPos: 0,
  maxYPos: 9,
};

export function initialSnake(): Position[] {
  return [
    { xPos: 0, yPos: 0 },
    { xPos: 1, yPos: 0 },
    { xPos: 2, yPos: 0 },
    { xPos: 3, yPos: 0 },
  ];
}
