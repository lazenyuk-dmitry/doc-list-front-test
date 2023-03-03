<script setup>
import AppCatalog from "~components/AppCatalog.vue";
import TheHeader from "~components/TheHeader.vue";
import AppSearchInput from "~components/AppSearchInput.vue";
</script>

<template>
  <main>
    <TheHeader />

    <div class="container">
      <AppSearchInput :class="$style.searchInput" v-model="searchString" />
      <AppCatalog :searchString="searchString" />
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      searchString: "",
    };
  },
};
</script>

<style lang="scss" module>
.searchInput {
  max-width: 564px;
  margin: 23px 0 15px 0;
}
</style>
