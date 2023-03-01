<template>
  <div :class="[$style.root, { [$style.rootCollapsed]: isCollapsed }]">
    <div :class="setSectionClass">
      <AppButton
        v-if="isCollapsed"
        :class="[$style.sectionBtn, { [$style.collapse]: isCollapse }]"
        icon="chevronTo"
        @click="toggleCollapse"
      />
      <h3 :class="$style.itemTitle">{{ data.title }}</h3>
      <div v-if="data.marker.length" :class="$style.markers">
        <AppDocMarker
          v-for="(marker, index) in data.marker"
          :key="index"
          :class="$style.marker"
          :color="marker"
        />
      </div>
      <h5 v-if="data.important" :class="$style.importantText">Обязательный</h5>
      <p :class="$style.itemDesc">{{ data.desc }}</p>
      <div :class="$style.actionButtons">
        <button :class="$style.actionButton" type="button">
          <AppIcon icon="pen" />
        </button>
        <button :class="$style.actionButton" type="button">
          <AppIcon icon="trash" />
        </button>
        <button
          :class="$style.actionButton"
          type="button"
          data-draggable
          @mousedown="isDragged = true"
          @mouseout="isDragged = false"
          @mouseup="isDragged = false"
        >
          <AppIcon v-if="isDragged" icon="doubleVertArrowBlue" />
          <AppIcon v-else icon="doubleVertArrow" />
        </button>
      </div>
    </div>
    <div
      ref="collapsed"
      :class="[$style.nestedItemsContainer, { [$style.collapse]: isCollapse }]"
    >
      <slot name="nested" />
    </div>
  </div>
</template>

<script>
import EventBus from "~helpers/eventBus";
import AppButton from "~components/AppButton.vue";
import AppDocMarker from "~components/AppDocMarker.vue";
import AppIcon from "~components/AppIcon.vue";

export default {
  components: { AppButton, AppDocMarker, AppIcon },
  props: {
    data: {
      type: Object,
      required: true,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
    dragItemUid: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      animationId: null,
      isDragged: false,
      isCollapse: true,
      collapseStep: 20,
    };
  },
  computed: {
    setSectionClass() {
      return this.isCollapsed ? this.$style.section : this.$style.item;
    },
  },
  mounted() {
    EventBus.$on("item-changed", (itemId) => {
      console.log(itemId, this.dragItemUid);
    });
  },
  methods: {
    collapseDown(collapsedEl) {
      const maxHeight = collapsedEl.style.maxHeight
        ? parseInt(collapsedEl.style.maxHeight)
        : 0;

      if (maxHeight > 0) {
        collapsedEl.style.maxHeight = `${maxHeight - this.collapseStep}px`;
        this.animationId = requestAnimationFrame(
          this.collapseDown.bind(null, collapsedEl)
        );
      } else {
        collapsedEl.style.display = "none";
      }
    },
    collapseUp(collapsedEl, targetHeight) {
      const maxHeight = collapsedEl.style.maxHeight
        ? parseInt(collapsedEl.style.maxHeight)
        : 0;

      if (maxHeight < targetHeight) {
        collapsedEl.style.maxHeight = `${maxHeight + this.collapseStep}px`;
        this.animationId = requestAnimationFrame(
          this.collapseUp.bind(null, collapsedEl, targetHeight)
        );
      }
    },
    toggleCollapse() {
      const collapsedEl = this.$refs.collapsed;

      collapsedEl.style.display = "block";

      const targetHeight = collapsedEl.scrollHeight;
      const maxHeight = collapsedEl.style.maxHeight
        ? parseInt(collapsedEl.style.maxHeight)
        : 0;

      cancelAnimationFrame(this.animationId);

      if (maxHeight) {
        this.animationId = requestAnimationFrame(
          this.collapseDown.bind(null, collapsedEl, targetHeight)
        );

        this.isCollapse = true;
      } else {
        this.animationId = requestAnimationFrame(
          this.collapseUp.bind(null, collapsedEl, targetHeight)
        );

        this.isCollapse = false;
      }
    },
  },
};
</script>

<style lang="scss" module>
.rootCollapsed {
  + .root:not(.rootCollapsed) {
    margin-top: 20px;
  }
}

%itemLine {
  background: #ffffff;
  border: 1px solid #dfe4ef;
  min-height: 48px;
  padding: 16px 13px;
  display: flex;
  align-items: center;
}

.section {
  @extend %itemLine;
}

.sectionBtn {
  margin-right: 14px;
  flex-shrink: 0;
  transition: 0.2s ease-out;

  &.collapse {
    transform: rotate(180deg);
    transition: 0.2s ease-out;
  }
}

.itemTitle {
  font-weight: 500;
  font-size: 15px;
  margin: 0;
  white-space: nowrap;
}

.markers {
  margin-left: 15px;
  display: flex;
  align-items: center;
}

.marker {
  & + & {
    margin-left: 6px;
  }
}

.importantText {
  font-weight: 400;
  font-size: 11px;
  color: #ff238d;
  margin: 0;
  margin-left: 15px;
}

.itemDesc {
  font-weight: 400;
  font-size: 11px;
  color: #8e9cbb;
  margin: 0;
  margin-left: 15px;
  margin-right: 60px;
  white-space: nowrap;
  text-overflow: hidden;
  overflow: hidden;
  position: relative;
  width: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 50%);
  }
}

.actionButtons {
  margin-left: auto;
  flex-shrink: 0;
}

.actionButton {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 25px;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  & + & {
    margin-left: 5px;
  }
}

.item {
  @extend %itemLine;

  min-height: 35px;
  padding-top: 9px;
  padding-bottom: 9px;

  .itemTitle {
    font-weight: 500;
    font-size: 13px;
  }
}

.nestedItemsContainer {
  padding-left: 16px;
  max-height: 0;
  overflow: hidden;
}
</style>
