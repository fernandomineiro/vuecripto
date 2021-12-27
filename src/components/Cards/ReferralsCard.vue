<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-blue">
      <div class="card-icon">
        <i class="fas fa-user-friends"></i>
      </div>
      <h4 class="title">{{ $t("accSettings.listingUsers") }}</h4>
    </md-card-header>
    <md-card-content>
      <p>{{ $t("accSettings.amountReferrals") }}: {{ referrals.length }}</p>
      <md-table
        v-model="referrals"
        class="text-center"
        table-header-color="green"
        md-fixed-header
      >
        <md-table-row
          slot="md-table-row"
          class="text-center"
          slot-scope="{ item }"
        >
          <md-table-cell class="text-center" :md-label="$t('user')">
            {{ item.username }}
          </md-table-cell>
          <md-table-cell class="text-center" :md-label="$t('email')">
            {{ item.email }}
          </md-table-cell>
          <md-table-cell
            class="text-center"
            :md-label="$t('configurations.userType')"
          >
            {{ getUserType(item.user_type_id) }}
          </md-table-cell>
        </md-table-row>
      </md-table>
    </md-card-content>
  </md-card>
</template>

<script>
import user from "@/api/user";
import { getUserTypeId as getUserType } from "@/utils";

export default {
  name: "referrals",
  data() {
    return {
      referrals: []
    };
  },
  methods: {
    getUserType
  },
  created() {
    user
      .getReferrals(this.$store.state.ActiveSession.token)
      .then(res => (this.referrals = res))
      .catch(err => console.error(err));
  }
};
</script>

<style scoped>
.fas {
  font-size: 1rem;
}
</style>
