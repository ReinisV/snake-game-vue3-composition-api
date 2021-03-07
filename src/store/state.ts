import { buildGame, Direction, Position } from '@/game-logic';
import { State } from 'vuex-simple';
import { convertStateToBeImmutable } from './types/readonly-modifiers';

class SnakeGameStateClass {
  public constructor() {
    this.game = buildGame();
  }

    @State()
    public game: {
        currentDirection: Direction,
        nextDirection: Direction,
        inQuickSpeed: boolean,
        points: number,

        snakeFragmentPositions: Position[],

        foodPosition: Position
    };
}

// expose the state class, but make it look like its readonly (so nobody modifies it outright)
export const SnakeGameState = convertStateToBeImmutable(SnakeGameStateClass);

// but also expose a mutable type, so that mutations can use it (because only they are allowed to modify it)
export type MutableSnakeGameState = SnakeGameStateClass;
