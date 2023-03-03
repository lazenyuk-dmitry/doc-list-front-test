<template>
  <div
    ref="dropZone"
    :data-drag-zone="zoneUid"
    :data-group="group"
    v-bind="$attrs"
  >
    <TransitionGroup :name="$style.list">
      <AppDraggableItem
        v-for="(item, index) in rawData"
        :key="item.id"
        :data="item"
        :index="index"
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

    const a = interact(this.getDropZoneEl).dropzone({
      overlap: 0.8,
      listeners,
      checker: this.checker,
    });

    EventBus.$on("data-changed", ({ data, zoneUid }) => {
      if (this.zoneUid === zoneUid) {
        const zoneEl = document.querySelector(`[data-drag-zone="${zoneUid}"]`);
        const itemWrapEl = zoneEl.closest("[data-draggable-item]");

        if (itemWrapEl) {
          this.emitItemEvent("item-changed", itemWrapEl);
        }

        this.$emit("update:data", data);
        this.$emit("end", data);
      }
    });

    EventBus.$on("dropped-on-child", (targetIndex, insertPosition, zoneUid) => {
      if (this.zoneUid === zoneUid) {
        this.emitDroppedEvent(targetIndex, insertPosition);
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
    removePlaceholders() {
      const allPlaceholders = document.querySelector(
        "." + this.placeholder.className
      );

      if (allPlaceholders) {
        allPlaceholders.remove();
      }
    },
    calcPosition(target) {
      const targetGroup = target.getAttribute("data-group");
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
        insertPosition = "append";
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
          targetEl = item;

          return;
        } else if (
          bottomOffset < this.maxOffset &&
          bottomOffset > this.minOffset
        ) {
          targetIndex = index;
          insertPosition = "after";
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

      EventBus.$emit(eventName, itemUid);
    },
    emitDroppedEvent(
      targetIndex = this.targetIndex,
      insertPosition = this.insertPosition
    ) {
      EventBus.$emit(
        "dropped",
        this.rawData,
        targetIndex,
        insertPosition,
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
    insertPlaceholder(target) {
      const { insertPosition, dragZoneEl, targetEl } =
        this.calcPosition(target);

      this.removePlaceholders();

      switch (insertPosition) {
        case "append":
          dragZoneEl.append(this.placeholder);
          break;

        case "before":
          targetEl.before(this.placeholder);
          break;

        case "after":
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

      this.targetIndex = targetIndex;
      this.insertPosition = insertPosition;

      if (childZoneUid) {
        EventBus.$emit(
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
.placeholder {
  height: 5px;
  background: #0066ff;
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
