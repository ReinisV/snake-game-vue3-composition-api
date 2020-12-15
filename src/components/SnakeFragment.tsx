
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Snake',
  props: {
    xPosInPx: String,
    yPosInPx: String,
    widthInPx: String,
    heightInPx: String,
    color: String
  },

  render () {
    return <div
      class="text"
      style={{
        position: 'absolute',
        left: this.xPosInPx,
        top: this.yPosInPx,
        width: this.widthInPx,
        height: this.heightInPx,
        // 'background-color': this.color,
        border: '2px dashed ' + this.color
      }}
    ></div>;
  }

});
