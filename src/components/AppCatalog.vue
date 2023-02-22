<template>
  <div :class="$style.root">
    <draggable
      :list="getSortedDocuments"
      group="section"
      item-key="id"
      handle=".drag-handle"
    >
      <template #item="{ element }">
        <AppCatalogItem
          :data="element"
          :isCollapsed="element.type === sectionType"
        >
          <template #nested>
            <draggable
              :list="element.child"
              group="child"
              item-key="id"
              handle=".drag-handle"
            >
              <template #item="{ element }">
                <AppCatalogItem :data="element" />
              </template>
            </draggable>
          </template>
        </AppCatalogItem>
      </template>
    </draggable>

    <div :class="$style.unsorted">
      <draggable
        :list="getUnsortedDocuments"
        group="child"
        item-key="id"
        handle=".drag-handle"
      >
        <template #item="{ element }">
          <AppCatalogItem :data="element" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

import AppCatalogItem from "~components/AppCatalogItem.vue";

import { DOCUMENT_TYPE } from "~constants";

export default {
  components: { draggable, AppCatalogItem },
  computed: {
    ...mapGetters("documents", ["getSortedDocuments", "getUnsortedDocuments"]),
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
    ...mapActions("documents", ["fetchDocuments"]),
    setSectionClass(type) {
      switch (type) {
        case this.sectionType:
          return this.$style.section;
        case this.itemType:
          return this.$style.item;
      }
    },
    getComponentData() {
      return {
        handle: ".my-handle",
      };
    },
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
