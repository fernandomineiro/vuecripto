<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-blue">
      <div class="card-icon">
        <i class="fas fa-user-friends"></i>
      </div>
      <h4 class="title">{{ $t("profile.referrals.referralsPerLevel") }}</h4>
    </md-card-header>
    <md-card-content>
      <md-table
        v-model="referralsCount"
        table-header-color="green"
        md-fixed-header
      >
        <md-table-row
          slot="md-table-row"
          slot-scope="{ item }"
          v-if="item.count > 0"
        >
          <md-table-cell
            class="text-left col-level"
            :md-label="$t('profile.referrals.level')"
          >
            {{ item.level }}
          </md-table-cell>
          <md-table-cell class="text-left" :md-label="$t('customers')">
            {{ item.count }}
          </md-table-cell>
          <!-- <md-table-cell class="text-left" :md-label="$t('customers')">
            {{ item.gain }}
          </md-table-cell> -->
        </md-table-row>
      </md-table>
    </md-card-content>
  </md-card>
</template>

<script>
import user from "@/api/user";

export default {
  name: "referrals-count-card",
  data() {
    return {
      referralsCount: []
    };
  },
  methods: {
    /**
     * Set model value for table from API's response
     *
     * @param {object} levelsCount
     */
    setCount(levelsCount) {
      const levels = [1, 2, 3, 4, 5, 6, 7];
      this.referralsCount = levels.map(level => ({
        level,
        count: levelsCount[level] || 0
      }));
    }
  },
  created() {
    user
      .getReferralsCount()
      .then(res => this.setCount(res))
      .catch(err => console.error(err));
  }
};
</script>

<style scoped>
.fas {
  font-size: 1rem;
}

.md-table-cell {
  padding-top: 0;
  padding-bottom: 0;
  height: 1.75rem;
}
</style>
