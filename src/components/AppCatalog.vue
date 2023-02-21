<template>
  <div :class="$style.root">
    <template v-for="(item, index) in getDocuments" :key="index">
      <div :class="setSectionClass(item.type)">
        <AppButton
          v-if="item.type === sectionType"
          :class="$style.sectionBtn"
          icon="chevronTo"
        />
        <h3 :class="$style.itemTitle">{{ item.title }}</h3>
        <div v-if="item.marker.length" :class="$style.markers">
          <AppDocMarker
            v-for="(marker, index) in item.marker"
            :key="index"
            :class="$style.marker"
            :color="marker"
          />
        </div>
        <h5 v-if="item.important" :class="$style.importantText">
          Обязательный
        </h5>
        <p :class="$style.itemDesc">{{ item.desc }}</p>
        <div :class="$style.actionButtons">
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="pen" />
          </button>
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="trash" />
          </button>
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="doubleVertArrow" />
          </button>
        </div>
      </div>

      <div
        v-for="(childItem, childIndex) in item.child"
        :key="index + childIndex"
        :class="[$style.item, $style.itemNested]"
      >
        <h3 :class="$style.itemTitle">{{ childItem.title }}</h3>
        <div v-if="childItem.marker.length" :class="$style.markers">
          <AppDocMarker
            v-for="(childMarker, index) in childItem.marker"
            :key="index"
            :class="$style.marker"
            :color="childMarker"
          />
        </div>
        <h5 v-if="childItem.important" :class="$style.importantText">
          Обязательный
        </h5>
        <p :class="$style.itemDesc">{{ childItem.desc }}</p>
        <div :class="$style.actionButtons">
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="pen" />
          </button>
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="trash" />
          </button>
          <button :class="$style.actionButton" type="button">
            <AppIcon icon="doubleVertArrow" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AppButton from "~components/AppButton.vue";
import AppDocMarker from "~components/AppDocMarker.vue";
import AppIcon from "~components/AppIcon.vue";

import { DOCUMENT_TYPE } from "~constants";

export default {
  components: { AppButton, AppDocMarker, AppIcon },
  computed: {
    ...mapGetters("documents", ["getDocuments"]),
  },
  data() {
    return {
      sectionType: DOCUMENT_TYPE.SECTION,
      itemType: DOCUMENT_TYPE.ITEM,
    };
  },
  mounted() {
    this.fetchDocuments();
  },
  methods: {
    ...mapActions("documents", ["fetchDocuments"]),
    setSectionClass(type) {
      switch (type) {
        case this.sectionType:
          return this.$style.section;
        case this.itemType:
          return this.$style.item;
      }
    },
  },
};
</script>

<style lang="scss" module>
.root {
  max-width: 1190px;
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

  ~ .itemNested {
    margin-left: 16px;
  }

  & + .item:not(.itemNested) {
    margin-top: 20px;
  }
}

.sectionBtn {
  margin-right: 14px;
  flex-shrink: 0;
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
</style>
