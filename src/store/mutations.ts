import { buildGame, Direction, Position, randomPosition } from '@/game-logic';
import { Mutation } from 'vuex-simple';
import { SnakeGameGetters } from './getters';
import { SnakeGameState } from './state';
import type { MutableSnakeGameState } from './state';

// extend getters class, but make it look like the state is mutable (because mutations is the only one allowed to mutate it)
// note: I use Omit<> to pick out the mutable fields from getters close, otherwise those fields override the immutable
// states from mutable state and they are allowed to be written to
const SnakeGameGettersWithMutableSnakeGameState = SnakeGameGetters as unknown as {
    new(): Omit<SnakeGameGetters, keyof MutableSnakeGameState>
            & MutableSnakeGameState
};

class SnakeGameMutationsClass extends SnakeGameGettersWithMutableSnakeGameState {
    @Mutation()
  public SET_QUICK_SPEED(value: boolean): void {
    this.game.inQuickSpeed = value;
  }

  @Mutation()
    public SET_NEXT_DIRECTION(value: Direction): void {
      this.game.nextDirection = value;
    }

    @Mutation()
  public SET_ADVANCED_POSITIONS(value: Position[]): void {
    this.game.snakeFragmentPositions = value;
  }

    @Mutation()
    public SET_RANDOM_FOOD_POSITION(): void {
      this.game.foodPosition = randomPosition(this.boundaries, this.game.snakeFragmentPositions);
    }

  @Mutation()
    public APPLY_NEXT_DIRECTION_TO_DIRECTION(): void {
      this.game.currentDirection = this.game.nextDirection;
    }

  @Mutation()
  public SET_NEW_GAME(): void {
    this.game = buildGame();
    this.game.currentDirection = 'up';
  }

    @Mutation()
  public INCREASE_POINTS_BY_ONE(): void {
    this.game.points += 1;
  }

  @Mutation()
    public ADD_POSITION_AT_END_OF_SNAKE(value: Position): void {
      this.game.snakeFragmentPositions.unshift(value);
    }
}

// export mutations class for extending, but make it look like the state fields are immutable
export const SnakeGameMutations = SnakeGameMutationsClass as unknown as {
    new(): Omit<SnakeGameMutationsClass, keyof MutableSnakeGameState>
            & InstanceType<typeof SnakeGameState>
};
