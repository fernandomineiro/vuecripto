<template>
  <input
    class="md-input"
    v-model.lazy="model"
    v-bind="attributes"
    v-on="listeners"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script>
import MdComponent from "./MdComponent";
import MdUuid from "vue-material/src/core/utils/MdUuid";
import MdFieldMixin from "vue-material/src/components/MdField/MdFieldMixin";

export default new MdComponent({
  name: "LazyInput",
  mixins: [MdFieldMixin],
  inject: ["MdField"],
  props: {
    id: {
      type: String,
      default: () => "md-input-" + MdUuid()
    },
    type: {
      type: String,
      default: "text"
    }
  },
  computed: {
    toggleType() {
      return this.MdField.togglePassword;
    },
    isPassword() {
      return this.type === "password";
    },
    listeners() {
      var l = { ...this.$listeners };
      delete l.input;
      return l;
    }
  },
  watch: {
    type(type) {
      this.setPassword(this.isPassword);
    },
    toggleType(toggle) {
      if (toggle) {
        this.setTypeText();
      } else {
        this.setTypePassword();
      }
    }
  },
  methods: {
    setPassword(state) {
      this.MdField.password = state;
      this.MdField.togglePassword = false;
    },
    setTypePassword() {
      this.$el.type = "password";
    },
    setTypeText() {
      this.$el.type = "text";
    }
  },
  created() {
    this.setPassword(this.isPassword);
  },
  beforeDestroy() {
    this.setPassword(false);
  }
});
</script>
