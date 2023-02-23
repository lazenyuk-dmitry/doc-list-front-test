<template>
  <div
    @drop.stop="onDrop($event, data)"
    @dragover.prevent.stop
    @dragenter.prevent.stop
  >
    <div
      v-for="(item, index) in data"
      :key="item.id"
      :data="item"
      :data-index="index"
      @dragstart.stop="startDrag($event, item)"
    >
      <slot name="item" :item="item" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    group: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapGetters("draggable", ["getOldArray"]),
  },
  methods: {
    ...mapActions("draggable", ["setOldArray", "clear"]),
    getDropZoneDataSelector() {
      return this.$.uid;
    },
    getDropZoneDataSelectorJs() {
      return `[data-selector="${this.getDropZoneDataSelector()}"]`;
    },
    getItemIndex(parent, child) {
      return [...parent.children].indexOf(child);
    },
    startDrag(e, item) {
      const target = e.target.closest("[data-index]");
      const itemIndex = target.dataset.index;

      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";

      e.dataTransfer.setData("itemId", item.id);
      e.dataTransfer.setData("group", this.group);
      e.dataTransfer.setData("index", itemIndex);

      this.setOldArray(this.data);
    },
    onDrop(e, newArray) {
      const target = e.target.closest("[data-index]");
      const newIndex = parseInt(target.dataset.index);
      const oldIndex = parseInt(e.dataTransfer.getData("index"));
      const oldGroup = e.dataTransfer.getData("group");
      const oldArray = this.getOldArray;

      if (oldArray === newArray) {
        newArray.splice(newIndex, 0, newArray.splice(oldIndex, 1)[0]);
      } else if (oldGroup === this.group) {
        newArray.splice(newIndex, 0, oldArray.splice(oldIndex, 1)[0]);
      }

      this.clear();
    },
  },
};
</script>
