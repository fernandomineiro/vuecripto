<template>
  <badge :type="badgeClass">
    {{ text }}
  </badge>
</template>

<script>
import { Badge } from "@/components";
import statusBadgeClass from "@/utils/statusBadgeClass";

const statuses = {
  1: "pending",
  2: "inReview",
  3: "rejected",
  4: "approved"
};

export default {
  name: "document-status-badge",
  components: {
    Badge
  },
  props: {
    status: { type: Number, default: 1 }
  },
  computed: {
    badgeClass() {
      return statusBadgeClass(this.status);
    },
    text() {
      const status = statuses[this.status];
      // \u2014 = &mdash;
      return status ? this.$t(`statuses.${status}`) : "\u2014";
    }
  }
};
</script>
