<script setup>
import AppIcon from "~components/AppIcon.vue";
</script>

<template>
  <button
    :class="[
      $style.btn,
      { [$style.withIcon]: this.icon, [$style.onlyIcon]: this.isOnlyIcon },
    ]"
    type="button"
  >
    <AppIcon :class="$style.icon" :icon="icon" />

    <slot />
  </button>
</template>

<script>
import ICONS from "~constants/icons.js";

export default {
  props: {
    icon: {
      type: String,
      required: false,
      validator(value) {
        return Object.keys(ICONS).includes(value);
      },
    },
  },
  computed: {
    isOnlyIcon() {
      return !this.$slots.default;
    },
  },
};
</script>

<style lang="scss" module>
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 1px solid #d3d8df;
  border-radius: 50px;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 20px;
  cursor: pointer;
  transition: 0.6s;

  &.withIcon {
    padding-left: 10px;

    .icon {
      margin-right: 10px;
    }
  }

  &.onlyIcon {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    padding: 0;

    .icon {
      margin: 0;
    }
  }

  &:hover {
    background-color: #d3d8df;
    transition: 0.6s;
  }

  &:disabled {
    cursor: not-allowed;
    transition: 0.6s;
  }
}
</style>
