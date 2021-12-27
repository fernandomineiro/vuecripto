<template>
  <div class="TVChartContainer" :id="containerId" />
</template>

<script>
import { widget } from "./charting_library.min";

const libraryPath = "/charting_library/";
const datafeedUrl = process.env.VUE_APP_API_ADMIN + "/charts";

export default {
  name: "TVChart",
  props: {
    symbol: {
      type: String,
      required: true
    },
    interval: {
      type: String,
      default: "1D"
    },
    containerId: {
      type: String,
      default: "tv_chart_container"
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    autosize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tvWidget: null
    };
  },
  watch: {
    symbol(val) {
      this.tvWidget.setSymbol(val, this.interval);
    }
  },
  mounted() {
    const widgetOptions = {
      symbol: this.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(datafeedUrl),
      interval: this.interval,
      container_id: this.containerId,
      library_path: libraryPath,
      locale: "pt",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      fullscreen: this.fullscreen,
      autosize: this.autosize
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }
};
</script>

<style lang="scss" scoped>
.TVChartContainer {
  height: calc(100vh - 80px);
}
</style>
