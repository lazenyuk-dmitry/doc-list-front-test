<template>
  <div ref="dropZone">
    <AppDraggableItem
      v-for="(item, index) in rawData"
      :key="item.id"
      :data="item"
      :index="index"
      :allowFrom="handle"
      @start="dragStart($event)"
    >
      <template #item="{ item }">
        <slot name="item" :item="item" />
      </template>
    </AppDraggableItem>
  </div>
</template>

<script>
import interact from "interactjs";
import { mapActions, mapGetters } from "vuex";

import AppDraggableItem from "~components/AppDraggableItem.vue";

export default {
  components: { AppDraggableItem },
  props: {
    data: {
      type: Array,
      required: true,
    },
    group: {
      type: String,
      required: false,
    },
    handle: {
      type: String || HTMLElement,
      default: "*",
    },
  },
  data() {
    return {
      targetIndex: null,
      insertPosition: null,
      placeholder: document.createElement("hr"),
      minOffset: 0,
      maxOffset: 40,
    };
  },
  mounted() {
    const listeners = {
      drop: this.drop,
      move: this.move,
    };

    interact(this.getDropZoneEl).dropzone({
      listeners,
    });
  },
  computed: {
    ...mapGetters("draggable", ["getOldArray", "getDraggableItem"]),
    getDropZoneEl() {
      return this.$refs.dropZone;
    },
    rawData() {
      return this.data;
    },
  },
  methods: {
    ...mapActions("draggable", ["setOldArray", "setDraggableItem", "clear"]),
    getDropZoneDataSelector() {
      return this.$.uid;
    },
    getDropZoneDataSelectorJs() {
      return `[data-selector="${this.getDropZoneDataSelector()}"]`;
    },
    getItemIndex(parent, child) {
      return [...parent.children].indexOf(child);
    },
    getNewItemIndex() {
      const oldIndex = this.getDraggableItem.index;
      const calcPosition =
        this.targetIndex > oldIndex ? this.targetIndex - 1 : this.targetIndex;

      if (this.insertPosition === "before") {
        return calcPosition;
      } else if (this.insertPosition === "after") {
        return calcPosition + 1;
      }

      return 0;
    },
    dragStart(data) {
      this.setDraggableItem(data);
      this.setOldArray(this.rawData);
    },
    move(event) {
      const target = event.target;
      const dragEvent = event.dragEvent;
      const dragItemRect = dragEvent.rect;

      const zoneChild = [...target.children].filter(
        (item) => item !== this.placeholder
      );

      this.placeholder.remove();

      zoneChild.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const topOffset = dragItemRect.top - itemRect.top;
        const bottomOffset = itemRect.bottom - dragItemRect.bottom;

        if (topOffset < this.maxOffset && topOffset > this.minOffset) {
          this.targetIndex = index;
          this.insertPosition = "before";

          item.before(this.placeholder);
        } else if (
          bottomOffset < this.maxOffset &&
          bottomOffset > this.minOffset
        ) {
          this.targetIndex = index;
          this.insertPosition = "after";

          item.after(this.placeholder);
        }
      });
    },
    drop(event) {
      const oldArray = this.getOldArray;
      const oldIndex = this.getDraggableItem.index;
      const newIndex = this.getNewItemIndex();

      if (oldIndex !== this.targetIndex) {
        this.rawData.splice(newIndex, 0, oldArray.splice(oldIndex, 1)[0]);

        this.$emit("update:data", this.rawData);
        this.$emit("end", this.rawData);
      }

      this.clear();
      this.placeholder.remove();
      this.draggableItemData = null;
    },
  },
};
</script>
