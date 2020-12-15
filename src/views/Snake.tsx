
import { Boundaries, Direction, directionsAreOpposite, Game, randomFood, updatePositions } from '@/game-logic';
import { calculateModifierX, calculateModifierY, mapEventKeyToDirection, mapFragmentTo } from '@/screen-logic';
import { defineComponent, onMounted, reactive, computed } from 'vue';

import SnakeFragment from '@/components/SnakeFragment';

export default defineComponent({
  name: 'Snake',

  setup () {
    const initialDirection: Direction = 'right';
    const boundaries: Boundaries = {
      minXPos: 0,
      maxXPos: 19,
      minYPos: 0,
      maxYPos: 19,
    };

    const buildGame = (): Game => {
      return {
        snakeFragmentPositions: [
          { xPos: 0, yPos: 0, color: 'red' },
          { xPos: 1, yPos: 0, color: 'red' },
          { xPos: 2, yPos: 0, color: 'red' },
          { xPos: 3, yPos: 0, color: 'red' },
        ],
        currentDirection: initialDirection,
        nextDirection: initialDirection,
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
      snakeFragments: computed(() => state.game.snakeFragmentPositions.map(fragment => mapFragmentTo(fragment, state.modifiers))),
      foodFragment: computed(() => mapFragmentTo(state.game.foodPosition, state.modifiers))
    };

    onMounted(() => {
      window.addEventListener('resize', () => {
        state.modifiers.pxModifierX = calculateModifierX(window.innerWidth, boundaries);
        state.modifiers.pxModifierY = calculateModifierY(window.innerHeight, boundaries);
      });

      window.setInterval(() => {
        updatePositions(state.game, boundaries, () => {
          state.game = reactive(buildGame());
        });
      }, 600);

      document.addEventListener('keydown', evt => {
        const inputtedDirection = mapEventKeyToDirection(evt.key);

        if (inputtedDirection === null) {
          return;
        }

        if (directionsAreOpposite(inputtedDirection, state.game.currentDirection)) {
          return;
        }

        state.game.nextDirection = inputtedDirection;
      });
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
