<template>
  <svg
    :class="$style.icon"
    :height="getSize.height"
    :width="getSize.width"
    v-bind="getStyle"
  >
    <use :href="iconUrl" />
  </svg>
</template>

<script>
import ICONS from "~constants/icons.js";

export default {
  props: {
    icon: {
      type: String,
      required: true,
      validator(value) {
        return Object.keys(ICONS).includes(value);
      },
    },
  },
  computed: {
    spriteUrl() {
      return new URL(`@/assets/svg-sprite.svg`, import.meta.url).href;
    },
    iconUrl() {
      return `${this.spriteUrl}#${this.icon}`;
    },
    getSize() {
      const { height, width } = ICONS[this.icon];

      return { height, width };
    },
    getStyle() {
      return ICONS[this.icon].style;
    },
  },
};
</script>

<style lang="scss" module>
.icon {
  display: inline-block;
}
</style>
