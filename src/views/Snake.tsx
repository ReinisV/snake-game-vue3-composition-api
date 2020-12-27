import { getDirectionFromTo, Direction, Position } from '@/game-logic';
import { calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFoodTo, mapFragmentTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed, onUnmounted } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';
import { eventManager, Unsubscribe } from '@/event-manager';
import Food from '@/components/Food';
import { mapButBetter } from '@/array-helpers';
import { store } from '@/store';

export default defineComponent({
  name: 'Snake',

  setup() {
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
      snakeFragments: computed(() => buildSnakeViewFragments(
        {
          pxModifierX: modifiers.pxModifierX.value,
          pxModifierY: modifiers.pxModifierY.value
        },
        store.game.snakeFragmentPositions)),
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

type PositionWithDirections = Position & { prevDirection: Direction | null, nextDirection: Direction | null };

function updateTailFragment(payload: { current: Position, next: Position }): PositionWithDirections {
  const { current: tailFragment, next: nextFragment } = payload;

  const snakeViewFragment = {
    ...tailFragment,
    prevDirection: null,
    nextDirection: getDirectionFromTo({
      firstFragment: tailFragment,
      secondFragment: nextFragment
    }),
  };

  return snakeViewFragment;
}

function updateMiddleFragment(payload: { previous: Position, current: Position, next: Position }): PositionWithDirections {
  const { previous: previousFragment, current: currentFragment, next: nextFragment } = payload;

  const snakeViewFragment = {
    ...currentFragment,
    prevDirection: getDirectionFromTo({
      firstFragment: currentFragment,
      secondFragment: previousFragment
    }),
    nextDirection: getDirectionFromTo({
      firstFragment: currentFragment,
      secondFragment: nextFragment
    }),
  };

  return snakeViewFragment;
}

function updateHeadFragment(payload: { previous: Position, current: Position }): PositionWithDirections {
  const { previous: previousFragment, current: headFragment } = payload;

  const snakeViewFragment = {
    ...headFragment,
    prevDirection: getDirectionFromTo({
      firstFragment: headFragment,
      secondFragment: previousFragment
    }),
    nextDirection: null,
  };

  return snakeViewFragment;
}

function buildSnakeViewFragments(modifiers: { pxModifierX: number, pxModifierY: number }, snakeFragmentPositions: Position[]) {
  const snakeFragmentPositionsWithDirections = mapButBetter(snakeFragmentPositions, {
    firstEntryCallback: updateTailFragment,
    middleEntryCallback: updateMiddleFragment,
    lastEntryCallback: updateHeadFragment
  });

  const snakeViewFragments = snakeFragmentPositionsWithDirections.map(fragment => mapFragmentTo({
    fragment: fragment,
    modifiers: modifiers
  }));
  return snakeViewFragments;
}
