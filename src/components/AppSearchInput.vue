<script setup>
import AppIcon from "~components/AppIcon.vue";
import AppButton from "~components/AppButton.vue";
</script>

<template>
  <label :class="$style.root">
    <AppIcon :class="$style.searchIcon" icon="search" />
    <input
      :class="$style.input"
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      @input="onInput($event)"
    />
    <Transition name="fade">
      <AppButton
        v-if="modelValue"
        :class="$style.clearBtn"
        icon="cross"
        transparent
        @click="clearValue()"
      />
    </Transition>
  </label>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    debounce: {
      type: Number,
      default: 500,
    },
    placeholder: {
      type: String,
      default: "Поиск",
    },
  },
  data() {
    return {
      debounceTimer: null,
    };
  },
  methods: {
    onInput(event) {
      const value = event.target.value;

      this.updateModelValue(value);
    },
    clearValue() {
      clearTimeout(this.debounceTimer);
      this.$emit("update:modelValue", "");
    },
    updateModelValue(value) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.$emit("update:modelValue", value);
      }, this.debounce);
    },
  },
};
</script>

<style lang="scss" module>
.root {
  display: flex;
  position: relative;
}

.input {
  display: block;
  width: 100%;
  border: none;
  border-bottom: $app-input-underline;
  outline: none;
  padding: 15px 15px 15px 27px;

  font-weight: 500;
  font-size: 15px;
  font-style: italic;

  &:focus {
    border-color: $app-active-color;
  }
}

.searchIcon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.clearBtn {
  position: absolute;
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
}
</style>
