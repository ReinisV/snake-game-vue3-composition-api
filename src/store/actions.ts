import { mapButBetter } from '@/array-helpers';
import { Direction, directionsAreOpposite, Position, Boundaries, calculateNextPos } from '@/game-logic';
import { Action } from 'vuex-simple';
import { SnakeGameMutations } from './mutations';
import { DeepReadonlyArray } from './types/readonly-types';

export class SnakeGameActions extends SnakeGameMutations {
    @Action()
  public updateSnakeDirection(
    inputtedDirection: Direction | null
  ): void {
    if (inputtedDirection === null) {
      return;
    }

    if (directionsAreOpposite(inputtedDirection, this.game.currentDirection)) {
      return;
    }

    this.SET_NEXT_DIRECTION(inputtedDirection);
  }

    @Action()
    moveForward(): void {
      // copy it before applying SET_ADVANCED_POSITIONS
      const copyOfOldTailPosition = {
        ...this.game.snakeFragmentPositions[0]
      };

      const newPositions = this.moveEachPositionForward(
        this.game.snakeFragmentPositions,
        this.game.nextDirection,
        this.boundaries);
      this.SET_ADVANCED_POSITIONS(newPositions);

      const newHeadPosition = this.game.snakeFragmentPositions[this.game.snakeFragmentPositions.length - 1];
      const nonHeadPositions = this.game.snakeFragmentPositions.slice(0, this.game.snakeFragmentPositions.length - 1);

      if (newHeadPosition.xPos === this.game.foodPosition.xPos &&
            newHeadPosition.yPos === this.game.foodPosition.yPos) {
        // food collected
        this.SET_RANDOM_FOOD_POSITION();
        // add an extra piece to the end
        this.ADD_POSITION_AT_END_OF_SNAKE(copyOfOldTailPosition);
        this.INCREASE_POINTS_BY_ONE();
      } else {
        const crash = nonHeadPositions.some(fragmentPos =>
          fragmentPos.xPos === newHeadPosition.xPos &&
                fragmentPos.yPos === newHeadPosition.yPos);
        if (crash) {
          this.SET_NEW_GAME();
          return;
        }
      }

      this.APPLY_NEXT_DIRECTION_TO_DIRECTION();
    }

    private moveEachPositionForward(
      snakeFragmentPositions: DeepReadonlyArray<Position>,
      nextDirection: Direction,
      boundaries: Boundaries
    ): Position[] {
      return mapButBetter(snakeFragmentPositions, {
        firstEntryCallback: ({ next: nextFragment }) => {
          return {
            xPos: nextFragment.xPos,
            yPos: nextFragment.yPos,
          };
        },
        middleEntryCallback: ({ next: nextFragment }) => {
          return {
            xPos: nextFragment.xPos,
            yPos: nextFragment.yPos,
          };
        },
        lastEntryCallback: ({ current: currentFragment }) => {
          return calculateNextPos(nextDirection, currentFragment, boundaries);
        }
      });
    }

    @Action()
    public increaseSpeed(inputtedDirection: Direction): void {
      if (this.game.nextDirection === inputtedDirection) {
        this.SET_QUICK_SPEED(true);
      }
    }

    @Action()
    public decreaseSpeed(inputtedDirection: Direction): void {
      if (this.game.nextDirection === inputtedDirection) {
        this.SET_QUICK_SPEED(false);
      }
    }
}
