<template>
  <div
    ref="item"
    :class="{ [$style.clone]: isDragged }"
    :data-draggable-item="itemUid"
    :data-draggable-group="group"
  >
    <slot name="item" :item="data" :uid="itemUid" />
  </div>
</template>

<script>
import { nextTick } from "vue";
import interact from "interactjs";
import DragItemBus from "~helpers/DragItemBus";

export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    allowFrom: {
      type: String || HTMLElement,
      default: "*",
    },
    group: {
      type: String,
      required: true,
    },
  },
  computed: {
    gerDraggableEl() {
      return this.$refs.item;
    },
    componentData() {
      return {
        data: this.data,
        index: this.index,
      };
    },
    itemUid() {
      return this.$.uid;
    },
  },
  data() {
    return {
      ghost: null,
      isDragged: false,
    };
  },
  mounted() {
    const listeners = {
      start: this.start,
      move: this.move,
      end: this.end,
    };

    interact(this.gerDraggableEl).draggable({
      origin: "self",
      allowFrom: this.allowFrom,
      listeners,
    });
  },
  unmounted() {
    interact(this.gerDraggableEl).unset();
  },
  methods: {
    start(event) {
      const target = event.target;
      this.ghost = target.cloneNode(true);

      this.ghost.classList.add(this.$style.ghost);
      this.ghost.setAttribute("data-ghost", this.group);

      this.ghost.style.position = "absolute";
      this.ghost.style.width = event.rect.width + "px";
      this.ghost.style.height = event.rect.height + "px";
      this.ghost.style.top = event.rect.top + "px";
      this.ghost.style.left = event.rect.left + "px";

      document.body.appendChild(this.ghost);

      this.isDragged = true;

      nextTick(() => {
        DragItemBus.$emit("drag-start", this.itemUid);

        this.$emit("start", this.componentData);
      });
    },
    move(event) {
      if (this.ghost) {
        this.ghost.style.top = event.rect.top + "px";
        this.ghost.style.left = event.rect.left + "px";
      }
    },
    end() {
      if (this.ghost) {
        this.ghost.remove();
        this.ghost = null;
      }

      this.isDragged = false;

      nextTick(() => {
        DragItemBus.$emit("drag-stop", this.itemUid);
        this.$emit("end", this.componentData);
      });
    },
  },
};
</script>

<style lang="scss" module>
.ghost {
  box-shadow: $drag-ghost-shadow;
}

.clone {
  opacity: 0.2;
}
</style>
