
import { directionsAreOpposite, Game, randomFood, updatePositions } from '@/game-logic';
import { calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFragmentTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed, onUnmounted } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';
import { eventManager, Unsubscribe } from '@/event-manager';
import { initialBoundaries, initialDirection, initialSnake } from '@/defaults';

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
      snakeFragments: computed(() => state.game.snakeFragmentPositions.map(
        fragment => {
          const snakeViewFragment = mapFragmentTo({
            fragment: fragment,
            modifiers: state.modifiers
          });
          return snakeViewFragment;
        })),

      foodFragment: computed(() => mapFragmentTo({
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
      }, 600));

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
          console.log('heldDownStart', evt.key);
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          if (state.game.nextDirection === inputtedDirection) {
            state.game.nextMoveSpeed = 2;
          }
        },
        heldDownEnd: (evt) => {
          console.log('heldDownEnd', evt.key);
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          if (state.game.nextDirection === inputtedDirection) {
            state.game.nextMoveSpeed = 1;
          }
        },
        keyHeldDownInterval: 200,
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
          color={snakeFragment.color} />
      )}
      <SnakeFragment
        xPosInPx={this.foodFragment.xPosInPx}
        yPosInPx={this.foodFragment.yPosInPx}
        widthInPx={this.foodFragment.widthInPx}
        heightInPx={this.foodFragment.heightInPx}
        color={this.foodFragment.color} />
    </div>;
  }

});
