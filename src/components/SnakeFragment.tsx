import { Direction, directionsAreNextToEachOther, getOppositeDirection, isVerticalDirection } from '@/game-logic';
import { mapDirectionToBorderProp } from '@/screen-logic';
import { defineComponent } from 'vue';

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
  render () {
    const styleObject = {
      position: 'absolute',
      left: this.xPosInPx,
      top: this.yPosInPx,
      width: this.widthInPx,
      height: this.heightInPx,
      backgroundColor: this.color,
      opacity: 0.8,
    };

    if (this.prevDirection !== null &&
      this.nextDirection !== null &&
      directionsAreNextToEachOther(this.prevDirection as Direction, this.nextDirection as Direction)) {
      const oppositePrevDirection = getOppositeDirection(this.prevDirection as Direction);
      const oppositeNextDirection = getOppositeDirection(this.nextDirection as Direction);

      let connected = '';
      if (isVerticalDirection(oppositePrevDirection)) {
        connected = `${mapDirectionToBorderProp(oppositePrevDirection)}-${mapDirectionToBorderProp(oppositeNextDirection)}`;
      } else {
        connected = `${mapDirectionToBorderProp(oppositeNextDirection)}-${mapDirectionToBorderProp(oppositePrevDirection)}`;
      }

      const borderProp = `border-${connected}-radius`;
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
