
import { directionsAreOpposite, Game, getDirectionFromTo, randomFood, updatePositions, SnakeFragment as SnakeFragmentType, Direction } from '@/game-logic';
import { calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFoodTo, mapFragmentTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed, onUnmounted } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';
import { eventManager, Unsubscribe } from '@/event-manager';
import { initialBoundaries, initialDirection, initialSnake } from '@/defaults';
import Food from '@/components/Food';
import { mapButBetter } from '@/array-helpers';

export default defineComponent({
  name: 'Snake',

  setup () {
    const boundaries = {
      ...initialBoundaries
    };

    const buildGame = (): Game => {
      return {
        snakeFragmentPositions: initialSnake(),
        currentDirection: initialDirection,
        nextDirection: initialDirection,
        nextMoveSpeed: 1,
        foodPosition: randomFood(boundaries),
      };
    };

    const state = reactive({
      game: buildGame(),
      modifiers: {
        pxModifierX: calculateModifierX(window.innerWidth, boundaries),
        pxModifierY: calculateModifierY(window.innerHeight, boundaries)
      }
    });

    const exposedState = {
      snakeFragments: computed(() => {
        const snakeFragmentPositionsWithDirections = mapButBetter<SnakeFragmentType, SnakeFragmentType & {prevDirection: Direction | null, nextDirection: Direction | null}>(state.game.snakeFragmentPositions, {
          firstEntryCallback: (payload) => {
            const { current: tailFragment, next: nextFragment } = payload;

            const snakeViewFragment = {
              ...tailFragment,
              prevDirection: null,
              nextDirection: getDirectionFromTo(tailFragment, nextFragment),
            };

            return snakeViewFragment;
          },

          middleEntryCallback: (payload) => {
            const { previous: previousFragment, current: currentFragment, next: nextFragment } = payload;

            const snakeViewFragment = {
              ...currentFragment,
              prevDirection: getDirectionFromTo(currentFragment, previousFragment),
              nextDirection: getDirectionFromTo(currentFragment, nextFragment),
            };

            return snakeViewFragment;
          },

          lastEntryCallback: (payload) => {
            const { previous: previousFragment, current: headFragment } = payload;

            const snakeViewFragment = {
              ...headFragment,
              prevDirection: getDirectionFromTo(headFragment, previousFragment),
              nextDirection: null,
            };

            return snakeViewFragment;
          },
        });

        const snakeViewFragments = snakeFragmentPositionsWithDirections.map(fragment => mapFragmentTo({
          fragment: fragment,
          modifiers: state.modifiers
        }));
        return snakeViewFragments;
      }),

      foodFragment: computed(() => mapFoodTo({
        fragment: state.game.foodPosition,
        modifiers: state.modifiers
      }))
    };

    const eventSubscribers: Unsubscribe[] = [];

    onUnmounted(() => {
      eventSubscribers.forEach(unsubscriber => unsubscriber());
    });

    onMounted(() => {
      eventSubscribers.push(eventManager.onWindowResize(() => {
        state.modifiers.pxModifierX = calculateModifierX(window.innerWidth, boundaries);
        state.modifiers.pxModifierY = calculateModifierY(window.innerHeight, boundaries);
      }));

      eventSubscribers.push(eventManager.onInterval(() => {
        updatePositions(state.game, boundaries, () => {
          state.game = reactive(buildGame());
        });
      }, computed(() => 1000 / state.game.nextMoveSpeed)));

      eventSubscribers.push(eventManager.onKeyDown((evt) => {
        const inputtedDirection = mapEventKeyToDirection(evt.key);

        if (inputtedDirection === null) {
          return;
        }

        if (directionsAreOpposite(inputtedDirection, state.game.currentDirection)) {
          return;
        }

        state.game.nextDirection = inputtedDirection;
      }));

      eventSubscribers.push(eventManager.onKeyHeldDown({
        heldDownStart: (evt) => {
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          if (state.game.nextDirection === inputtedDirection) {
            state.game.nextMoveSpeed = 2;
          }
        },
        heldDownEnd: (evt) => {
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          if (state.game.nextDirection === inputtedDirection) {
            state.game.nextMoveSpeed = 1;
          }
        }
      }));
    });

    return exposedState;
  },

  render () {
    return <div>
      {this.snakeFragments.map(snakeFragment =>
        <SnakeFragment
          xPosInPx={snakeFragment.xPosInPx}
          yPosInPx={snakeFragment.yPosInPx}
          widthInPx={snakeFragment.widthInPx}
          heightInPx={snakeFragment.heightInPx}
          color={snakeFragment.color}
          // it would be cool to get non-nullability working for props too
          prevDirection={snakeFragment.prevDirection!}
          nextDirection={snakeFragment.nextDirection!} />
      )}
      <Food
        xPosInPx={this.foodFragment.xPosInPx}
        yPosInPx={this.foodFragment.yPosInPx}
        widthInPx={this.foodFragment.widthInPx}
        heightInPx={this.foodFragment.heightInPx}
        color={this.foodFragment.color} />
    </div>;
  }

});
