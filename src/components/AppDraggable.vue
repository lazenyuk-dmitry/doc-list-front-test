<template>
  <div
    ref="dropZone"
    :class="$style.root"
    :data-drag-zone="zoneUid"
    :data-group="group"
    v-bind="$attrs"
  >
    <TransitionGroup :name="$style.list">
      <AppDraggableItem
        v-for="(item, index) in getDataAfterSearch"
        :key="item.id"
        :data="item"
        :index="findItemIndex(item) || index"
        :allowFrom="handle"
        :group="group"
        @start="dragStart($event)"
      >
        <template #item="{ item, uid }">
          <slot name="item" :item="item" :uid="uid" />
        </template>
      </AppDraggableItem>
    </TransitionGroup>
  </div>
</template>

<script>
import interact from "interactjs";
import { toRaw } from "vue";

import DropZoneBus from "~helpers/dropZoneBus";
import DragItemBus from "~helpers/dropZoneBus";
import { intersectRect } from "~helpers";
import { INSERT_POSITION } from "~constants";
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
    searchFunction: {
      type: Function,
      required: false,
    },
  },
  data() {
    return {
      debounceTimer: null,
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

    interact(this.getDropZoneEl).dropzone({
      overlap: 0.8,
      listeners,
      checker: this.checker,
    });

    DropZoneBus.$on("data-changed", this.onDataChanged.bind(this));
    DropZoneBus.$on("dropped-on-child", this.onDropOnChildZone.bind(this));
  },
  unmounted() {
    interact(this.getDropZoneEl);
    DropZoneBus.$off("data-changed", this.onDataChanged);
    DropZoneBus.$off("dropped-on-child", this.onDropOnChildZone);
  },
  computed: {
    getDropZoneEl() {
      return this.$refs.dropZone;
    },
    getItemComponent() {
      return this.$refs.itemComponent;
    },
    oldArray() {
      return this.getOldArray;
    },
    getDataAfterSearch() {
      return this.searchFunction
        ? this.searchFunction(this.rawData)
        : this.rawData;
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
    onDataChanged({ data, zoneUid }) {
      if (this.zoneUid === zoneUid) {
        const zoneEl = document.querySelector(`[data-drag-zone="${zoneUid}"]`);
        const itemWrapEl = zoneEl.closest("[data-draggable-item]");

        if (itemWrapEl) {
          this.emitItemEvent("item-changed", itemWrapEl);
        }

        this.$emit("update:data", data);
        this.$emit("end", data);
      }
    },
    onDropOnChildZone(targetIndex, insertPosition, zoneUid) {
      if (this.zoneUid === zoneUid) {
        this.emitDroppedEvent(targetIndex, insertPosition);
      }
    },
    removePlaceholders() {
      const allPlaceholders = document.querySelector(
        "." + this.placeholder.className
      );

      if (allPlaceholders) {
        allPlaceholders.remove();
      }
    },
    findItemIndex(item) {
      const index = this.rawData.indexOf(item);

      return index !== -1 ? index : null;
    },
    calcPosition(target) {
      const ghostEl = document.querySelector("body > [data-ghost]");
      const ghostUid = parseInt(ghostEl.getAttribute("data-draggable-item"));
      const ghostGroup = ghostEl.getAttribute("data-ghost");
      const ghostRect = ghostEl.getBoundingClientRect();

      let targetIndex = null;
      let insertPosition = null;
      let dragZoneEl = null;
      let targetEl = null;
      let childZoneGroup = null;
      let childZoneUid = null;

      const zoneChild = [...target.children].filter(
        (item) => item !== this.placeholder
      );

      // If empty zone
      if (
        !zoneChild.length &&
        intersectRect(ghostRect, target.getBoundingClientRect())
      ) {
        targetIndex = 0;
        insertPosition = INSERT_POSITION.APPEND;
        dragZoneEl = target;
      }

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
          targetEl = item;
          targetIndex = index;
          insertPosition = INSERT_POSITION.APPEND;
          childZoneUid = parseInt(
            childDragZoneEl.getAttribute("data-drag-zone")
          );
          dragZoneEl = childDragZoneEl;
          return;
        }

        if (topOffset < this.maxOffset && topOffset > this.minOffset) {
          targetIndex = index;
          insertPosition = INSERT_POSITION.BEFORE;
          targetEl = item;

          return;
        } else if (
          bottomOffset < this.maxOffset &&
          bottomOffset > this.minOffset
        ) {
          targetIndex = index;
          insertPosition = INSERT_POSITION.AFTER;
          targetEl = item;

          return;
        }
      });

      return {
        targetEl,
        targetIndex,
        insertPosition,
        dragZoneEl,
        childZoneGroup,
        childZoneUid,
      };
    },
    emitItemEvent(eventName, targetEl) {
      const itemUid = targetEl
        ? parseInt(targetEl.getAttribute("data-draggable-item"))
        : null;

      DragItemBus.$emit(eventName, itemUid);
    },
    emitDroppedEvent(
      targetIndex = this.targetIndex,
      insertPosition = this.insertPosition
    ) {
      DropZoneBus.$emit(
        "dropped",
        this.rawData,
        targetIndex,
        insertPosition,
        this.zoneUid,
        this.group
      );
    },
    dragStart(data) {
      DropZoneBus.$emit(
        "set-data-transfer",
        this.rawData,
        data.data,
        data.index,
        this.zoneUid,
        this.group
      );
    },
    insertPlaceholder(target) {
      const { insertPosition, dragZoneEl, targetEl } =
        this.calcPosition(target);

      this.removePlaceholders();

      switch (insertPosition) {
        case INSERT_POSITION.APPEND:
          dragZoneEl.append(this.placeholder);
          break;

        case INSERT_POSITION.BEFORE:
          targetEl.before(this.placeholder);
          break;

        case INSERT_POSITION.AFTER:
          targetEl.after(this.placeholder);
          break;

        default:
          this.removePlaceholders();
          break;
      }

      this.emitItemEvent("drag-move", targetEl);
    },
    move(event) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        const target = event.target;

        this.insertPlaceholder(target);
      }, 100);
    },
    drop(event) {
      const target = event.target;
      const { targetIndex, targetEl, insertPosition, childZoneUid } =
        this.calcPosition(target);

      this.targetIndex = this.findItemIndex(this.rawData[targetIndex]);
      this.insertPosition = insertPosition;

      if (childZoneUid) {
        DropZoneBus.$emit(
          "dropped-on-child",
          targetIndex,
          insertPosition,
          childZoneUid
        );

        this.emitItemEvent("drag-drop", targetEl);
        this.placeholder.remove();

        return;
      }

      if (insertPosition) {
        this.emitDroppedEvent();
      }

      this.emitItemEvent("drag-drop", targetEl);

      this.removePlaceholders();
    },
    dragleave() {
      this.removePlaceholders();
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

      const isHidden = this.getDropZoneEl.closest("[data-hidden='true']");

      return (
        (ghostGroup === this.group || ghostGroup === childZoneGroup) &&
        !isHidden &&
        intersectRect(ghostRect, zoneRect)
      );
    },
  },
};
</script>

<style lang="scss" module>
.root {
  min-height: 1px; // Fix for overlap calc.
}

.placeholder {
  height: 5px;
  background: $app-active-color;
  margin: 0;
}

.list {
  &:global(-move),
  &:global(-leave-active),
  &:global(-enter-active) {
    transition: all 0.5s ease;
  }

  &:global(-enter-from),
  &:global(-leave-to) {
    opacity: 0;
  }

  &:global(-leave-active) {
    position: absolute;
  }
}
</style>
