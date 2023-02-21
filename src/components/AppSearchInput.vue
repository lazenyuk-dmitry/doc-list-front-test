<script setup>
import AppIcon from "~components/AppIcon.vue";
import AppButton from "~components/AppButton.vue";
</script>

<template>
  <label :class="$style.root">
    <AppIcon :class="$style.searchIcon" icon="search" />
    <input :class="$style.input" type="text" placeholder="Поиск" />
    <AppButton :class="$style.clearBtn" icon="cross" transparent />
  </label>
</template>

<style lang="scss" module>
.root {
  display: flex;
  position: relative;
}

.input {
  display: block;
  width: 100%;
  border: none;
  border-bottom: 1px solid #bfc9e0;
  outline: none;
  padding: 15px 15px 15px 27px;

  font-weight: 500;
  font-size: 15px;
  font-style: italic;

  &:focus {
    border-color: #0066ff;
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
