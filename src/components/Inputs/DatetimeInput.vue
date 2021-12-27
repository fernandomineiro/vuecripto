<template>
  <lazy-input
    v-if="useMask"
    v-bind="$props"
    type="tel"
    :placeholder="placeholder"
    :value="lazyValue"
    @input="onLazyInput"
    v-mask="mask"
  />
  <md-input
    type="text"
    value=""
    v-else-if="!(this.value || this.hasFocus)"
    @focus.prevent="focused"
  />
  <md-input
    v-bind="$props"
    @input="onInput"
    @blur="blurred"
    ref="datetimeInput"
    v-else
  />
</template>

<script>
/**
 * @author Gabriel Mineiro <gabrielpfgmineiro@gmail.com>
 * @description This component circunvents two major problems with time, date
 * and datetime-local type inputs:
 *   1. Field labels overlaping the input default placeholder
 *   2. Lack of support for those field types in Safari
 * For Safari, the input appears as text type and a mask is applied according to
 * the actual type. For the other browsers, an empty text type input is
 * displayed while it is empty or out of focus.
 */

import LazyInput from "./LazyInput";

const localeMask = {
  "pt-br": {
    date: "##/##/####",
    time: "##:##",
    "datetime-local": "####-##-##T##:##:##"
  },
  "en-us": {
    date: "####-##-##",
    time: "##:##",
    "datetime-local": "####-##-##T##:##:##"
  }
};

const localeFormat = {
  "pt-br": {
    date: "DD/MM/YYYY",
    time: "HH:mm",
    "datetime-local": "YYYY-MM-DD[T]HH:mm:ss"
  },
  "en-us": {
    date: "YYYY-MM-DD",
    time: "HH:mm",
    "datetime-local": "YYYY-MM-DD[T]HH:mm:ss"
  }
};

const outputFormat = {
  date: "YYYY-MM-DD",
  time: "HH:mm",
  "datetime-local": "YYYY-MM-DD[T]HH:mm:ss"
};

export default {
  name: "datetime-input",
  components: {
    LazyInput
  },
  props: {
    type: {
      default: "date",
      validator: value => ["date", "time", "datetime-local"].includes(value)
    },
    value: { type: String }
  },
  data() {
    const locale = this.$i18n.locale || "en-us";
    return {
      locale,
      lazyValue: this.value
        ? this.$moment(this.value).format(localeFormat[locale][this.type])
        : "",
      hasFocus: false,
      useMask: ["safari"].includes(this.$browser.name)
    };
  },
  computed: {
    /**
     * @description The mask to be used according to the input type
     * @type {string}
     */
    mask() {
      return localeMask[this.locale][this.type];
    },
    placeholder() {
      return this.type == "date"
        ? this.$t("dateLocalFormat")
        : this.type == "time"
        ? this.$t("timeFormat")
        : `${this.$t("dateIsoFormat")}T${this.$t("timeFormat")}`;
    }
  },
  methods: {
    focused() {
      this.hasFocus = true;
      this.$nextTick(() => this.$refs.datetimeInput.$el.focus());
    },
    blurred() {
      this.hasFocus = false;
    },
    onLazyInput(value) {
      this.lazyValue = value;
      const format = localeFormat[this.locale][this.type];
      const output = this.$moment(value, format).format(
        outputFormat[this.type]
      );

      if (typeof output === "string" && !output.includes("Invalid")) {
        this.$emit("input", output);
        this.$emit("update:valid", true);
      } else {
        this.$emit("input", null);
        this.$emit("update:valid", false);
      }
    },
    onInput(value) {
      if (typeof value === "string" && this.$moment(value).isValid()) {
        this.$emit("input", value);
        this.$emit("update:valid", true);
      } else {
        this.$emit("input", null);
        this.$emit("update:valid", false);
      }
    }
  }
};
</script>
