<template>
  <object
    :class="$style.icon"
    :data="iconUrl"
    type="image/svg+xml"
    height="14px"
    width="14px"
  ></object>
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
    iconUrl() {
      return ICONS[this.icon];
    },
  },
};
</script>

<style lang="scss" module>
.icon {
  pointer-events: none;
}
</style>
