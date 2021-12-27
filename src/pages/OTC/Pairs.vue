<template>
  <md-card>
    <md-card-header class="md-card-header-blue">
      <h4>{{ $t("otc.pairs.otcPairs") }}</h4>
    </md-card-header>
    <md-card-content>
      <div class="md-layout" v-if="pairs">
        <div
          class="md-layout-item md-xsmall-size-100 md-medium-size-50 md-size-25"
          v-for="pair in pairs"
          :key="pair.id"
        >
          <md-card>
            <md-card-content>
              <h3 class="text-center">
                {{ pair.coin_base }}{{ pair.coin_quote }}
              </h3>
              <md-button
                class="md-danger md-block"
                @click="$emit('select', pair)"
              >
                {{ $t("otc.pairs.requestOtc") }}
              </md-button>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "pairs",
  computed: {
    ...mapGetters({
      pairs: "Pairs/otcPairs"
    })
  }
};
</script>

<style scoped>
.md-card-header {
  color: #fff;
}
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
