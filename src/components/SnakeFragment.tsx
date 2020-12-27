import { getBorderPropBasedOnDirections } from '@/fragment-border-logic';
import { Direction } from '@/game-logic';
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
    score: Number
  },

  // todo maybe something like
  // render (this: this as this & {prevDirection: Direction})
  // for TS typesafety
  render() {
    const styleObject = {
      // positioning
      position: 'absolute',
      left: this.xPosInPx,
      top: this.yPosInPx,
      width: this.widthInPx,
      height: this.heightInPx,
      backgroundColor: this.color,

      opacity: 0.8,

      // rounded corners
      borderRadius: getBorderPropBasedOnDirections({
        prevDirection: this.prevDirection as Direction,
        nextDirection: this.nextDirection as Direction,
      }),

      // for flex
      display: 'flex'
    };

    return <div
      // @ts-ignore
      style={styleObject}
    >
      { (this.score) ? <span style="margin: auto">{this.score}</span> : null }
      {/* <span>prev: {this.prevDirection}</span><br /><span>next: {this.nextDirection}</span> */}
    </div>;
  }

});
