import { initialBoundaries } from '@/defaults';
import { Boundaries } from '@/game-logic';
import { Getter } from 'vuex-simple';
import { SnakeGameState } from './state';

export class SnakeGameGetters extends SnakeGameState {
    @Getter()
  public get calculatedSpeed(): number {
    // each point increases speed by 25%
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
