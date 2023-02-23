<template>
  <div :class="$style.root">
    <div>
      <AppCatalogItem
        v-for="item in getSortedDocuments"
        :key="item.id"
        :data="item"
        :isCollapsed="item.type === sectionType"
      >
        <template #nested>
          <div>
            <AppCatalogItem
              v-for="nestedItem in item.child"
              :key="nestedItem.id"
              :data="nestedItem"
            />
          </div>
        </template>
      </AppCatalogItem>
    </div>

    <div
      :class="$style.unsorted"
      :data-selector="getDropZoneDataSelector()"
      @drop="onDrop($event, getUnsortedDocuments, this.groups.unsorted)"
      @dragover.prevent
      @dragenter.prevent
    >
      <AppCatalogItem
        v-for="(item, index) in getUnsortedDocuments"
        :key="item.id"
        :data="item"
        :data-index="index"
        @dragstart="startDrag($event, item, this.groups.unsorted)"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import AppCatalogItem from "~components/AppCatalogItem.vue";

import { DOCUMENT_TYPE } from "~constants";

export default {
  components: { AppCatalogItem },
  computed: {
    ...mapGetters("documents", ["getSortedDocuments", "getUnsortedDocuments"]),
  },
  data() {
    return {
      sectionType: DOCUMENT_TYPE.SECTION,
      itemType: DOCUMENT_TYPE.ITEM,
      groups: {
        unsorted: "unsorted",
      },
    };
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    ...mapActions("documents", ["fetchDocuments"]),
    getDropZoneDataSelector() {
      return this.$.uid;
    },
    getDropZoneDataSelectorJs() {
      return `[data-selector="${this.getDropZoneDataSelector()}"]`;
    },
    getItemIndex(parent, child) {
      return [...parent.children].indexOf(child);
    },
    getArrayByGroupName(groupName) {
      switch (groupName) {
        case this.groups.unsorted:
          return this.getUnsortedDocuments;
      }
    },
    setSectionClass(type) {
      switch (type) {
        case this.sectionType:
          return this.$style.section;
        case this.itemType:
          return this.$style.item;
      }
    },
    startDrag(e, item, group) {
      const target = e.target.closest("[data-index]");
      const dropZone = target.closest(this.getDropZoneDataSelectorJs());
      const itemIndex = target.dataset.index;

      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("itemId", item.id);
      e.dataTransfer.setData("group", group);
      e.dataTransfer.setData("index", itemIndex);
    },
    onDrop(e, dropArray, dropZoneGroup) {
      const target = e.target.closest("[data-index]");
      const dropZone = target.closest(this.getDropZoneDataSelectorJs());
      const newIndex = parseInt(target.dataset.index);
      const itemId = parseInt(e.dataTransfer.getData("itemId"));
      const itemGroup = e.dataTransfer.getData("group");
      const oldIndex = parseInt(e.dataTransfer.getData("index"));
      const oldArrayCopy = this.getArrayByGroupName(itemGroup);
      const dropArrayCopy = dropArray;

      console.log(newIndex, oldIndex, target);

      if (dropZoneGroup === itemGroup) {
        dropArrayCopy.splice(newIndex, 0, dropArrayCopy.splice(oldIndex, 1)[0]);

        console.log(dropArrayCopy);
      }
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
