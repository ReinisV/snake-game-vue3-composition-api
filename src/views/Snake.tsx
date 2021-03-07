import { buildSnakeViewFragments, calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFoodTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed, onUnmounted, watch } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';
import { eventManager, Unsubscribe } from '@/event-manager';
import Food from '@/components/Food';
import { store } from '@/store';
import router from '@/router';

export default defineComponent({
  name: 'Snake',

  setup() {
    store.SET_NEW_GAME();

    const watchableGameState = computed(() => store.game.state);
    watch(watchableGameState, (newValue) => {
      if (newValue === 'finished') {
        router.push({ name: 'Home' });
      }
    });

    const windowSize = reactive({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const modifiers = {
      pxModifierX: computed(() => calculateModifierX(windowSize.width, store.boundaries)),
      pxModifierY: computed(() => calculateModifierY(windowSize.height, store.boundaries))
    };

    const eventSubscribers: Unsubscribe[] = [];

    onMounted(() => {
      eventSubscribers.push(eventManager.onWindowResize(() => {
        windowSize.width = window.innerWidth;
        windowSize.height = window.innerHeight;
      }));

      eventSubscribers.push(eventManager.onInterval(() => {
        store.moveForward();
      }, computed(() => {
        const stepTimeInMs = 1000;
        return stepTimeInMs / store.calculatedSpeed;
      })));

      eventSubscribers.push(eventManager.onKeyDown((evt) => {
        const inputtedDirection = mapEventKeyToDirection(evt.key);
        store.updateSnakeDirection(inputtedDirection);
      }));

      eventSubscribers.push(eventManager.onKeyHeldDown({
        heldDownStart: (evt) => {
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          inputtedDirection && store.increaseSpeed(inputtedDirection);
        },
        heldDownEnd: (evt) => {
          const inputtedDirection = mapEventKeyToDirection(evt.key);
          inputtedDirection && store.decreaseSpeed(inputtedDirection);
        }
      }));
    });

    onUnmounted(() => {
      eventSubscribers.forEach(unsubscriber => unsubscriber());
    });

    return {
      snakeFragments: computed(() => {
        return buildSnakeViewFragments(
          {
            pxModifierX: modifiers.pxModifierX.value,
            pxModifierY: modifiers.pxModifierY.value
          },
          store.game.snakeFragmentPositions);
      }),
      foodFragment: computed(() => mapFoodTo({
        fragment: store.game.foodPosition,
        modifiers: {
          pxModifierX: modifiers.pxModifierX.value,
          pxModifierY: modifiers.pxModifierY.value
        }
      })),
      points: computed(() => store.game.points),
      inQuickSpeed: computed(() => store.game.inQuickSpeed)
    };
  },

  render() {
    return <div>
      {this.snakeFragments.map((snakeFragment, i) => {
        const isHead = i === this.snakeFragments.length - 1;
        const isPair = (i % 2) === 0;
        const color = this.inQuickSpeed
          ? isPair
            ? 'red'
            : 'gray'
          : 'white';

        return <SnakeFragment
          xPosInPx={snakeFragment.xPosInPx}
          yPosInPx={snakeFragment.yPosInPx}
          widthInPx={snakeFragment.widthInPx}
          heightInPx={snakeFragment.heightInPx}
          color={color}
          // it would be cool to get non-nullability working for props too
          prevDirection={snakeFragment.prevDirection!}
          nextDirection={snakeFragment.nextDirection!}
          score={isHead ? this.points : undefined} />;
      })}
      <Food
        xPosInPx={this.foodFragment.xPosInPx}
        yPosInPx={this.foodFragment.yPosInPx}
        widthInPx={this.foodFragment.widthInPx}
        heightInPx={this.foodFragment.heightInPx}
        color={'red'} />
    </div>;
  }

});
