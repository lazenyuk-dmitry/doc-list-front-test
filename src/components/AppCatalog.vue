<template>
  <div class="container">
    <div v-for="(item, index) in getDocuments" :key="index">
      {{ item.title }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("documents", ["getDocuments"]),
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    ...mapActions("documents", ["fetchDocuments"]),
  },
};
</script>
