<template>
  <div ref="dropZone" :data-drag-zone="zoneUid" :data-group="group">
    <AppDraggableItem
      v-for="(item, index) in rawData"
      :key="item.id"
      :data="item"
      :index="index"
      :allowFrom="handle"
      :group="group"
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

import EventBus from "~helpers/eventBus";
import { intersectRect } from "~helpers";
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
      required: true,
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
      dragleave: this.dragleave,
    };

    this.placeholder.classList.add(this.$style.placeholder);

    const a = interact(this.getDropZoneEl).dropzone({
      overlap: 0.8,
      listeners,
      checker: this.checker,
    });

    EventBus.$on("data-changed", ({ data, zoneUid }) => {
      if (this.zoneUid === zoneUid) {
        this.$emit("update:data", data);
        this.$emit("end", data);
      }
    });

    EventBus.$on("dropped-on-child", (zoneUid) => {
      if (this.zoneUid === zoneUid) {
        this.emitDroppedEvent();
      }
    });
  },
  computed: {
    getDropZoneEl() {
      return this.$refs.dropZone;
    },
    getItemComponent() {
      return this.$refs.itemComponent;
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
    calcPosition(target) {
      const targetGroup = target.getAttribute("data-group");
      const ghostEl = document.querySelector("[data-ghost]");
      const ghostUid = parseInt(ghostEl.getAttribute("data-draggable-item"));
      const ghostGroup = ghostEl.getAttribute("data-ghost");
      const ghostRect = ghostEl.getBoundingClientRect();

      let targetIndex = null;
      let insertPosition = null;
      let dragZoneEl = null;
      let childZoneGroup = null;
      let childZoneUid = null;

      const zoneChild = [...target.children].filter(
        (item) => item !== this.placeholder
      );

      zoneChild.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const topOffset = ghostRect.top - itemRect.top;
        const bottomOffset = itemRect.bottom - ghostRect.bottom;
        const childDragZoneEl = item.querySelector("[data-drag-zone]");
        const itemUid = parseInt(item.getAttribute("data-draggable-item"));

        childZoneGroup = childDragZoneEl
          ? childDragZoneEl.getAttribute("data-group")
          : null;

        if (ghostUid === itemUid) {
          return;
        }

        // Find child drop zone target.
        if (
          childZoneGroup !== this.group &&
          childZoneGroup === ghostGroup &&
          childDragZoneEl &&
          intersectRect(ghostRect, itemRect)
        ) {
          targetIndex = index;
          insertPosition = "append";
          childZoneUid = parseInt(
            childDragZoneEl.getAttribute("data-drag-zone")
          );
          dragZoneEl = childDragZoneEl;

          return;
        }

        if (topOffset < this.maxOffset && topOffset > this.minOffset) {
          targetIndex = index;
          insertPosition = "before";
          dragZoneEl = item;

          return;
        } else if (
          bottomOffset < this.maxOffset &&
          bottomOffset > this.minOffset
        ) {
          targetIndex = index;
          insertPosition = "after";
          dragZoneEl = item;

          return;
        }
      });

      return {
        targetIndex,
        insertPosition,
        dragZoneEl,
        childZoneGroup,
        childZoneUid,
      };
    },
    emitDroppedEvent() {
      EventBus.$emit(
        "dropped",
        this.rawData,
        this.targetIndex,
        this.insertPosition,
        this.zoneUid,
        this.group
      );
    },
    dragStart(data) {
      EventBus.$emit(
        "set-data-transfer",
        this.rawData,
        data.data,
        data.index,
        this.zoneUid,
        this.group
      );
    },
    move(event) {
      const target = event.target;

      const { targetIndex, insertPosition, dragZoneEl } =
        this.calcPosition(target);

      switch (insertPosition) {
        case "append":
          dragZoneEl.append(this.placeholder);
          break;

        case "before":
          dragZoneEl.before(this.placeholder);
          break;

        case "after":
          dragZoneEl.after(this.placeholder);
          break;

        default:
          this.placeholder.remove();
          break;
      }

      this.targetIndex = targetIndex;
    },
    drop(event) {
      const target = event.target;
      const { targetIndex, insertPosition, childZoneUid } =
        this.calcPosition(target);

      this.targetIndex = targetIndex;
      this.insertPosition = insertPosition;

      if (childZoneUid) {
        EventBus.$emit("dropped-on-child", childZoneUid);
        this.placeholder.remove();

        return;
      }

      this.emitDroppedEvent();

      this.placeholder.remove();
    },
    dragleave() {
      this.placeholder.remove();
    },
    checker() {
      const ghostEl = document.querySelector("[data-ghost]");
      const ghostGroup = ghostEl.getAttribute("data-ghost");
      const ghostRect = ghostEl.getBoundingClientRect();
      const zoneRect = this.getDropZoneEl.getBoundingClientRect();
      const childDragZoneEl =
        this.getDropZoneEl.querySelector("[data-drag-zone]");
      const childZoneGroup = childDragZoneEl
        ? childDragZoneEl.getAttribute("data-group")
        : null;

      return (
        (ghostGroup === this.group || ghostGroup === childZoneGroup) &&
        intersectRect(ghostRect, zoneRect)
      );
    },
  },
};
</script>

<style lang="scss" module>
.placeholder {
  height: 5px;
  background: #0066ff;
  margin: 0;
}
</style>
