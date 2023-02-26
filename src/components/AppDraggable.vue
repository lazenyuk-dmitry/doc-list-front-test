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
import { toRaw } from "vue";
import { mapActions, mapGetters } from "vuex";

import EventBus from "~helpers/eventBus";
import AppDraggableItem from "~components/AppDraggableItem.vue";
import eventBus from "../helpers/eventBus";

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
      rawData: [],
      targetIndex: null,
      insertPosition: null,
      zoneUid: this.$.uid,
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

    eventBus.$on("data-changed", ({ data, zoneUid }) => {
      if (this.zoneUid === zoneUid) {
        console.log(this.zoneUid, zoneUid);
        console.log("cha", data);

        this.$emit("update:data", data);
        this.$emit("end", data);
      }
    });
  },
  computed: {
    ...mapGetters("draggable", ["getOldArray", "getDraggableItem"]),
    getDropZoneEl() {
      return this.$refs.dropZone;
    },
    newArrayCopy() {
      return [...this.rawData];
    },
    oldArray() {
      return this.getOldArray;
    },
  },
  watch: {
    data: {
      handler(newValue) {
        this.rawData = toRaw(newValue);
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    ...mapActions("draggable", [
      "setOldArray",
      "setDraggableItem",
      "removeFromOldArray",
      "clear",
    ]),
    getDropZoneDataSelector() {
      return this.$.uid;
    },
    getZoneUid() {
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
      EventBus.$emit(
        "set-data-transfer",
        this.rawData,
        data.data,
        data.index,
        this.zoneUid
      );
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
    async drop(event) {
      eventBus.$emit(
        "dropped",
        this.rawData,
        this.targetIndex,
        this.insertPosition,
        this.zoneUid
      );

      this.clear();
      this.placeholder.remove();
    },
  },
};
</script>
