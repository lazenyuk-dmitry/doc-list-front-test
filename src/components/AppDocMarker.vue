<template>
  <button
    type="button"
    :class="$style.marker"
    :style="{ backgroundColor: color }"
  >
    &nbsp;
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" module>
.marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  padding: 0;
  border-radius: 50%;
  background: #000000;
  cursor: pointer;
  border: transparent;
  outline: transparent;
}
</style>
