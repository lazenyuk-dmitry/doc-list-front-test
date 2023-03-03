<script setup>
import AppIcon from "~components/AppIcon.vue";
</script>

<template>
  <button :class="getCssClasses" type="button">
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
    transparent: {
      type: Boolean,
      defaultL: false,
    },
  },
  computed: {
    isOnlyIcon() {
      return !this.$slots.default;
    },
    getCssClasses() {
      return [
        this.$style.btn,
        {
          [this.$style.withIcon]: this.icon,
          [this.$style.onlyIcon]: this.isOnlyIcon,
          [this.$style.transparent]: this.transparent,
        },
      ];
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
  border: $app-btn-border;
  border-radius: 50px;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  padding: 8px 20px;
  cursor: pointer;
  transition: $app-btn-transition;

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
    background-color: $app-btn-bg-hover;
    transition: $app-btn-transition;
  }

  &:disabled {
    cursor: not-allowed;
    transition: $app-btn-transition;
  }

  &.transparent {
    background: none;
    border: none;
  }
}
</style>
