<script setup>
import AppButton from "~components/AppButton.vue";
</script>

<template>
  <header>
    <div class="container">
      <div :class="$style.headerRow">
        <h1>Документы</h1>

        <div>
          <AppButton :class="$style.btn" icon="bookmark" />
          <AppButton :class="$style.btn" icon="plus"> Новый тип </AppButton>
          <AppButton :class="$style.btn" icon="plus">
            Новый документ
          </AppButton>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" module>
.headerRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn {
  & + & {
    margin-left: 10px;
  }
}
</style>
