import { getDirectionFromTo, SnakeFragment as SnakeFragmentType, Direction, buildGame, gameLogic } from '@/game-logic';
import { calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFoodTo, mapFragmentTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed, onUnmounted } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';
import { eventManager, Unsubscribe } from '@/event-manager';
import { initialBoundaries } from '@/defaults';
import Food from '@/components/Food';
import { mapButBetter } from '@/array-helpers';

export default defineComponent({
  name: 'Snake',

  setup() {
    const state = reactive({
      game: buildGame(),
      modifiers: {
        pxModifierX: calculateModifierX(window.innerWidth, initialBoundaries),
        pxModifierY: calculateModifierY(window.innerHeight, initialBoundaries)
      }
    });

    function buildSnakeViewFragments() {
      type SnakeFragmentTypeWithDirections = SnakeFragmentType & { prevDirection: Direction | null, nextDirection: Direction | null };
      const snakeFragmentPositionsWithDirections = mapButBetter<SnakeFragmentType, SnakeFragmentTypeWithDirections>(state.game.snakeFragmentPositions, {
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
    }

    const exposedState = {
      snakeFragments: computed(() => buildSnakeViewFragments()),

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
        state.modifiers.pxModifierX = calculateModifierX(window.innerWidth, state.game.boundaries);
        state.modifiers.pxModifierY = calculateModifierY(window.innerHeight, state.game.boundaries);
      }));

      eventSubscribers.push(eventManager.onInterval(() => {
        gameLogic.moveForward(state.game, state.game.boundaries, () => {
          state.game = reactive(buildGame());
        });
      }, computed(() => 1000 / state.game.nextMoveSpeed)));

      eventSubscribers.push(eventManager.onKeyDown((evt) => {
        const inputtedDirection = mapEventKeyToDirection(evt.key);
        gameLogic.updateSnakeDirection(state.game, inputtedDirection);
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

    return {
      ...exposedState,
      gameState: state
    };
  },

  render() {
    return <div>
      {this.snakeFragments.map((snakeFragment, i) =>
        <SnakeFragment
          xPosInPx={snakeFragment.xPosInPx}
          yPosInPx={snakeFragment.yPosInPx}
          widthInPx={snakeFragment.widthInPx}
          heightInPx={snakeFragment.heightInPx}
          color={snakeFragment.color}
          // it would be cool to get non-nullability working for props too
          prevDirection={snakeFragment.prevDirection!}
          nextDirection={snakeFragment.nextDirection!}
          score={(i === this.snakeFragments.length - 1) ? this.gameState.game.points : undefined} />
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
