<template>
  <div ref="item">
    <slot name="item" :item="data" />
  </div>
</template>

<script>
import interact from "interactjs";

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
  },
  data() {
    return {
      gost: null,
    };
  },
  mounted() {
    const listeners = {
      start: this.start,
      move: this.move,
      end: this.end,
    };

    const interactItem = interact(this.gerDraggableEl).draggable({
      origin: "self",
      allowFrom: this.allowFrom,
      listeners,
    });
  },
  methods: {
    start(event) {
      const target = event.target;
      this.gost = target.cloneNode(true);

      this.gost.style.position = "absolute";
      this.gost.style.width = event.rect.width + "px";
      this.gost.style.height = event.rect.height + "px";
      this.gost.style.top = event.rect.top + "px";
      this.gost.style.left = event.rect.left + "px";

      document.body.appendChild(this.gost);

      this.$emit("start", this.componentData);
    },
    move(event) {
      if (this.gost) {
        this.gost.style.top = event.rect.top + "px";
        this.gost.style.left = event.rect.left + "px";
      }
    },
    end(event) {
      if (this.gost) {
        this.gost.remove();
        this.gost = null;
      }

      this.$emit("end", this.componentData);
    },
  },
};
</script>
