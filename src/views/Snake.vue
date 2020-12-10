<template>
  <div class="text"></div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "Snake",
  setup(props) {
    const calculateModifierY = () => window.innerHeight / (maxYPos - minYPos);
    const calculateModifierX = () => window.innerWidth / (maxXPos - minXPos);
    const buildEmptyPos = () => ({
      xPos: ref(0),
      yPos: ref(0)
    });

    const currentPos = buildEmptyPos();

    const color = ref("red");
    let direction: "left" | "right" | "up" | "down" = "left";

    const minXPos = 0;
    const maxXPos = 10;
    const minYPos = 0;
    const maxYPos = 10;
    const pxModifierX = ref(calculateModifierX());
    const pxModifierY = ref(calculateModifierX());

    onMounted(() => {
      window.addEventListener("resize", event => {
        pxModifierX.value = calculateModifierX();
        pxModifierY.value = calculateModifierY();
      });

      window.setInterval(() => {
        const newPos = calculateNextPos(direction, currentPos);
        currentPos.xPos.value = newPos.xPos;
        currentPos.yPos.value = newPos.yPos;
      }, 1000);

      const calculateNextPos = (
        currentDir: typeof direction,
        previousPos: ReturnType<typeof buildEmptyPos>
      ): {xPos: number, yPos: number} => {
        const newPos = {xPos: previousPos.xPos.value, yPos: previousPos.yPos.value};
        if (direction === "left") {
          newPos.xPos = previousPos.xPos.value - 1;
        } else if (direction === "right") {
          newPos.xPos = previousPos.xPos.value + 1;
        } else if (direction === "down") {
          newPos.yPos = previousPos.yPos.value + 1;
        } else if (direction === "up") {
          newPos.yPos = previousPos.yPos.value - 1;
        }

        if (newPos.xPos < minXPos) {
          newPos.xPos = maxXPos;
        } else if (newPos.xPos >= maxXPos) {
          newPos.xPos = minXPos;
        }

        if (newPos.yPos < minYPos) {
          newPos.yPos = maxYPos;
        } else if (newPos.yPos >= maxYPos) {
          newPos.yPos = minYPos;
        }

        return newPos;
      };

      document.addEventListener("keydown", evt => {
        if (evt.key === "ArrowLeft") {
          direction = "left";
        }
        if (evt.key === "ArrowRight") {
          direction = "right";
        }
        if (evt.key === "ArrowDown") {
          direction = "down";
        }
        if (evt.key === "ArrowUp") {
          direction = "up";
        }
      });
    });

    const xPosInPx = computed(() => {
      return currentPos.xPos.value * pxModifierX.value + "px";
    });
    const yPosInPx = computed(() => {
      return currentPos.yPos.value * pxModifierY.value + "px";
    });

    const widthInPx = computed(() => {
      return 1 * pxModifierX.value + "px";
    });

    const heightInPx = computed(() => {
      return 1 * pxModifierY.value + "px";
    });

    return {
      xPosInPx,
      yPosInPx,
      color,
      widthInPx,
      heightInPx
    };
  }
});
</script>

<style>
.text {
  position: absolute;
  left: v-bind(xPosInPx);
  top: v-bind(yPosInPx);
  width: v-bind(widthInPx);
  height: v-bind(heightInPx);
  background-color: v-bind(color);
}
</style>
