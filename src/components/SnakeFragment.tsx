import { Direction, directionsAreNextToEachOther, getOppositeDirection, isVerticalDirection } from '@/game-logic';
import { mapDirectionToBorderProp } from '@/screen-logic';
import { defineComponent } from 'vue';

/**
 * returns something like `border-top-right-radius`
 * where 'top' is the border prop value of Direction 'up'
 * and where 'right' is the border prop value of Direction 'right'
 * @param firstDirection first direction in the string (should always be vertical direction, i.e. either 'up' or 'down')
 * @param secondDirection second direction in the string (should always be horizontal direction, i.e. either 'left' or 'right')
 */
function getBorderProp(firstDirection: Direction, secondDirection: Direction): string {
  return `border-${mapDirectionToBorderProp(firstDirection)}-${mapDirectionToBorderProp(secondDirection)}-radius`;
}

function getBorderPropBasedOnDirections(payload: {
  prevDirection: Direction,
  nextDirection: Direction
}): string | null {
  const { prevDirection, nextDirection } = payload;

  const isMidFragment = prevDirection !== null &&
    nextDirection !== null;

  if (isMidFragment &&
    directionsAreNextToEachOther(prevDirection, nextDirection)) {
    // get the opposite corner for rounding
    const oppositePrevDirection = getOppositeDirection(prevDirection);
    const oppositeNextDirection = getOppositeDirection(nextDirection);

    if (isVerticalDirection(oppositePrevDirection)) {
      // vertical direction ('top' or 'bottom') must always come first
      return getBorderProp(oppositePrevDirection, oppositeNextDirection);
    } else {
      return getBorderProp(oppositeNextDirection, oppositePrevDirection);
    }
  }

  const isEndFragment = prevDirection === null;
  if (isEndFragment) {

  }

  return null;
}

export default defineComponent({
  name: 'SnakeFragment',
  props: {
    xPosInPx: String,
    yPosInPx: String,
    widthInPx: String,
    heightInPx: String,
    color: String,
    prevDirection: String,
    nextDirection: String,
  },

  // todo maybe something like
  // render (this: this as this & {prevDirection: Direction})
  // for TS typesafety
  render() {
    const styleObject = {
      position: 'absolute',
      left: this.xPosInPx,
      top: this.yPosInPx,
      width: this.widthInPx,
      height: this.heightInPx,
      backgroundColor: this.color,
      opacity: 0.8,
    };

    const borderProp = getBorderPropBasedOnDirections({
      prevDirection: this.prevDirection as Direction,
      nextDirection: this.nextDirection as Direction,
    });
    if (borderProp !== null) {
      // @ts-ignore
      styleObject[borderProp] = '40px';
    }

    return <div
      class="text"
      // @ts-ignore
      style={styleObject}
    >
      {/* <span>prev: {this.prevDirection}</span><br /><span>next: {this.nextDirection}</span> */}
    </div>;
  }

});
