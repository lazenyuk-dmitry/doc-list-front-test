<template>
  <div :class="$style.root">
    <AppDraggable
      v-model:data="sortedDocs"
      :searchFunction="search"
      handle="[data-draggable]"
      group="sorted"
    >
      <template #item="{ item, uid }">
        <AppCatalogItem
          :data="item"
          :isCollapsed="item.type === sectionType"
          :dragItemUid="uid"
          :openByDefault="item.id === 1"
        >
          <template #nested>
            <AppDraggable
              v-model:data="item.child"
              :searchFunction="search"
              handle="[data-draggable]"
              group="nested"
              @end="updSortedDocs(sortedDocs)"
            >
              <template #item="{ item, uid }">
                <AppCatalogItem :data="item" :dragItemUid="uid" />
              </template>
            </AppDraggable>
          </template>
        </AppCatalogItem>
      </template>
    </AppDraggable>

    <div :class="$style.unsorted">
      <AppDraggable
        v-model:data="unsortedDocs"
        :searchFunction="search"
        :class="{ [$style.unsortedDraggable]: !unsortedDocs.length }"
        handle="[data-draggable]"
        group="nested"
        empty-placeholder
      >
        <template #item="{ item, uid }">
          <AppCatalogItem :data="item" :dragItemUid="uid" />
        </template>
      </AppDraggable>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import AppCatalogItem from "~components/AppCatalogItem.vue";

import { DOCUMENT_TYPE } from "~constants";
import AppDraggable from "~components/AppDraggable.vue";

export default {
  components: { AppCatalogItem, AppDraggable },
  props: {
    searchString: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapGetters("documents", ["getSortedDocuments", "getUnsortedDocuments"]),
    unsortedDocs: {
      get() {
        return this.getUnsortedDocuments;
      },
      set(data) {
        this.updUnsortedDocs(data);
      },
    },
    sortedDocs: {
      get() {
        return this.getSortedDocuments;
      },
      set(data) {
        this.updSortedDocs(data);
      },
    },
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
    ...mapActions("documents", [
      "fetchDocuments",
      "updUnsortedDocs",
      "updSortedDocs",
    ]),

    search(data) {
      const search = data.filter((item) => {
        return Object.entries(item).filter(([key, value]) => {
          if (item.child && item.child.length) {
            return item.child.filter((item) => {
              return Object.entries(item).filter(([key, value]) => {
                return this.filter(key, value);
              }).length;
            }).length;
          }

          return this.filter(key, value);
        }).length;
      });

      return this.searchString ? search : data;
    },

    filter(key, value) {
      if (["type", "id", "marker", "important"].includes(key)) {
        return;
      }

      if (typeof value === "string") {
        return value.toLowerCase().includes(this.searchString.toLowerCase());
      }
    },
  },
};
</script>

<style lang="scss" module>
.root {
  max-width: 1190px;
}

.unsorted {
  margin-top: 20px;
}

.unsortedDraggable {
  min-height: 50px;
  transition: 0.6s;

  &:empty {
    background-color: #f5f3f3;
    transition: 0.6s;
  }
}
</style>
