<template>
  <md-card>
    <md-card-header class="md-card-header-danger">
      <h4>{{ $t("configurations.userPreferences") }}</h4>
    </md-card-header>
    <md-card-content>
      <md-table>
        <md-table-row>
          <md-table-cell>{{ $t("configurations.defaultLang") }}</md-table-cell>
          <md-table-cell>
            <lang-form-select />
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>
            {{ $t("configurations.defaultCurrency") }}
          </md-table-cell>
          <md-table-cell>
            <currency-form-select />
          </md-table-cell>
        </md-table-row>
      </md-table>
    </md-card-content>
  </md-card>
</template>

<script>
import CurrencyFormSelect from "@/components/CurrencyFormSelect";
import LangFormSelect from "@/components/LangFormSelect";

export default {
  name: "user-preferences",
  components: {
    CurrencyFormSelect,
    LangFormSelect
  }
};
</script>

<style scoped>
.md-card-header > h4 {
  font-weight: 700;
  margin-top: 10px;
  margin-bottom: 10px;
}

.md-table {
  overflow: visible;
}
</style>
