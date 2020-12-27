import { forEachButBetter } from '@/array-helpers';
import { initialBoundaries, initialDirection, initialSnake } from '@/defaults';
import { Boundaries, Direction, directionsAreOpposite, calculateNextPos, randomPosition, Position } from '@/game-logic';
import { Action, Getter, State } from 'vuex-simple';

export class MyStore {
  public constructor() {
    this.game = this.buildGame();
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

    private buildGame() {
      const snake = initialSnake();
      return {
        currentDirection: initialDirection,
        nextDirection: initialDirection,
        inQuickSpeed: false,
        points: 0,

        snakeFragmentPositions: snake,

        foodPosition: randomPosition(initialBoundaries, snake),
      };
    };

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

      this.game.nextDirection = inputtedDirection;
    }

    @Action()
    moveForward(): void {
      const oldTailPosition = {
        ...this.game.snakeFragmentPositions[0]
      };

      this.moveEachPositionForward(this.game.snakeFragmentPositions, this.game.nextDirection, this.boundaries);

      const newHeadPosition = this.game.snakeFragmentPositions[this.game.snakeFragmentPositions.length - 1];
      const nonHeadPositions = this.game.snakeFragmentPositions.slice(0, this.game.snakeFragmentPositions.length - 1);

      if (newHeadPosition.xPos === this.game.foodPosition.xPos &&
            newHeadPosition.yPos === this.game.foodPosition.yPos) {
        // food collected
        this.game.foodPosition = randomPosition(this.boundaries, this.game.snakeFragmentPositions);
        this.game.snakeFragmentPositions.unshift(oldTailPosition);
        this.game.points += 1;
      } else {
        const crash = nonHeadPositions.some(fragmentPos =>
          fragmentPos.xPos === newHeadPosition.xPos &&
                fragmentPos.yPos === newHeadPosition.yPos);
        if (crash) {
          this.game = this.buildGame();
          return;
        }
      }

      this.game.currentDirection = this.game.nextDirection;
    }

    private moveEachPositionForward(
      snakeFragmentPositions: Position[],
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

          const fragmentNewHeadPos = calculateNextPos(nextDirection, fragment, boundaries);
          fragment.xPos = fragmentNewHeadPos.xPos;
          fragment.yPos = fragmentNewHeadPos.yPos;
        },
      });
    }

    @Action()
    public increaseSpeed(inputtedDirection: Direction): void {
      if (this.game.nextDirection === inputtedDirection) {
        this.game.inQuickSpeed = true;
      }
    }

    @Action()
    public decreaseSpeed(inputtedDirection: Direction): void {
      if (this.game.nextDirection === inputtedDirection) {
        this.game.inQuickSpeed = false;
      }
    }

    @Getter()
    public get calculatedSpeed(): number {
      // each point increases speed by 20%
      const pointsModifier = 0.25 * (this.game.points || 1);

      // each next move speed increase speed by 2
      const speed = (1 + pointsModifier) * (this.game.inQuickSpeed ? 2 : 1);
      return speed;
    }

    @Getter()
    public get boundaries(): Boundaries {
      // for every 4 points increase by 1 block point increases area by 1 to each side
      const pointsModifier = Math.floor((this.game.points || 0) / 4);

      return {
        minXPos: initialBoundaries.minXPos * pointsModifier,
        maxXPos: initialBoundaries.maxXPos + pointsModifier,
        minYPos: initialBoundaries.minYPos * pointsModifier,
        maxYPos: initialBoundaries.maxYPos + pointsModifier,
      };
    }
}
