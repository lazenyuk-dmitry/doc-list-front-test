<template>
  <div :class="$style.root">
    <AppDraggable v-model:data="sortedDocs" group="sorted">
      <template #item="{ item }">
        <AppCatalogItem :data="item" :isCollapsed="item.type === sectionType">
          <template #nested>
            <AppDraggable
              v-model:data="item.child"
              handle="[data-draggable]"
              group="nested"
              @end="updSortedDocs(sortedDocs)"
            >
              <template #item="{ item }">
                <AppCatalogItem :data="item" />
              </template>
            </AppDraggable>
          </template>
        </AppCatalogItem>
      </template>
    </AppDraggable>

    <div :class="$style.unsorted">
      <AppDraggable
        v-model:data="unsortedDocs"
        handle="[data-draggable]"
        group="nested"
      >
        <template #item="{ item }">
          <AppCatalogItem :data="item" />
        </template>
      </AppDraggable>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import AppCatalogItem from "~components/AppCatalogItem.vue";

import { DOCUMENT_TYPE } from "~constants";
import AppDraggable from "~components/AppDraggable.vue";

export default {
  components: { AppCatalogItem, AppDraggable },
  computed: {
    ...mapGetters("documents", ["getSortedDocuments", "getUnsortedDocuments"]),
    unsortedDocs: {
      get() {
        return this.getUnsortedDocuments;
      },
      set(data) {
        this.updUnsortedDocs(data);
      },
    },
    sortedDocs: {
      get() {
        return this.getSortedDocuments;
      },
      set(data) {
        this.updSortedDocs(data);
      },
    },
  },
  data() {
    return {
      sectionType: DOCUMENT_TYPE.SECTION,
      itemType: DOCUMENT_TYPE.ITEM,
    };
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    ...mapActions("documents", [
      "fetchDocuments",
      "updUnsortedDocs",
      "updSortedDocs",
    ]),
  },
};
</script>

<style lang="scss" module>
.root {
  max-width: 1190px;
}

.unsorted {
  margin-top: 20px;
}
</style>
