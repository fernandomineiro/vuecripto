<template>
  <ul class="documents-card">
    <li
      v-for="item in documentTypes"
      :key="item.id"
      class="documents-item"
      :class="{ complete: isDisabled(item.id) }"
      @click="onSelectDocument(item)"
    >
      <div>
        <div class="documents-item-status">
          <status-badge
            v-if="getStatus(item.id)"
            :status="getStatus(item.id)"
            class="documents-item-badge"
          />
          <i class="text-info documents-item-icon" :class="item.icon"></i>
        </div>
        <div class="documents-item-description text-center">
          {{ getDescription(item) }}
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import StatusBadge from "@/components/DocumentStatusBadge";
import documentTypes from "@/utils/documentTypes";
import { STATUS_WAITING, STATUS_COMPLETE } from "@/utils/statuses";

export default {
  name: "documents-card",
  components: {
    StatusBadge
  },
  props: {
    status: { type: Object, default: () => null },
    profileType: { type: Number, default: 1 }
  },
  computed: {
    documentTypes() {
      return documentTypes.filter(x => x.requiredBy.includes(this.profileType));
    }
  },
  methods: {
    getStatus(key) {
      return this.status ? this.status[key] || null : null;
    },
    getDescription(item) {
      const document = item.title;
      const documentName = this.$t(`profile.documents.type.${document}`);
      return this.isDisabled(item.id)
        ? documentName
        : this.$t("profile.documents.attachImageFor", [documentName]);
    },
    isDisabled(id) {
      return [STATUS_COMPLETE, STATUS_WAITING].includes(this.getStatus(id));
    },
    onSelectDocument(item) {
      if (this.isDisabled(item.id)) {
        return;
      }
      this.$router.push({ path: "wizard-document" });
    }
  }
};
</script>

<style lang="scss" scoped>
.documents-card {
  list-style: none;
  padding: 0;

  .documents-item {
    padding: 0.5em;
    background: whitesmoke;
    border-radius: 0.5em;
    margin: 0.5em auto;
    cursor: pointer;

    &.complete {
      cursor: auto;
    }

    div {
      display: flex;
      flex-direction: row;
      align-items: center;

      div {
        padding: 0.5em;
      }
      .documents-item-status {
        flex-grow: 0;
        display: block;
        width: max-content;
        position: relative;
        .documents-item-badge {
          position: absolute;
          top: 0.5em;
        }
        .documents-item-icon {
          font-size: 3.5rem;
        }
      }
      .documents-item-description {
        flex-grow: 1;
        padding-left: 1.5em;
        z-index: 2;
      }
    }
  }
}
</style>
