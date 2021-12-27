<template>
  <md-card>
    <md-card-header class="md-card-header-icon md-card-header-blue">
      <div class="card-icon">
        <i class="fas fa-cog"></i>
      </div>
      <h4 class="title">{{ $t("accSettings.generalSettings") }}</h4>
    </md-card-header>
    <md-card-content>
      <md-table>
        <md-table-row>
          <md-table-cell class="text-center">
            {{ $t("accSettings.movingLimit") }} (R$)
          </md-table-cell>
          <md-table-cell class="text-center">
            {{ movingLimit }}
          </md-table-cell>
        </md-table-row>
      </md-table>
    </md-card-content>
  </md-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "general-settings-card",
  computed: {
    ...mapState({
      movingLimit: state => state.User.moving_limit,
      userType: state => state.User.user_type_id,
      username: state => state.User.username
    })
  }
};
</script>

<style scoped>
.fas {
  font-size: 1rem;
}
</style>
