<template>
  <div class="md-file">
    <md-icon>attachment</md-icon>

    <input
      class="md-input"
      readonly
      v-model="model"
      v-bind="{ disabled, required, placeholder }"
      @focus="openPicker"
      @blur="onBlur"
    />

    <input
      type="file"
      ref="inputFile"
      v-bind="attributes"
      v-on="$listeners"
      @change="onChange"
    />
  </div>
</template>

<script>
import MdUuid from "vue-material/src/core/utils/MdUuid";
import MdFieldMixin from "vue-material/src/components/MdField/MdFieldMixin";

export default {
  name: "ValidFile",
  data() {
    return {
      files: []
    };
  },
  props: {
    id: {
      type: String,
      default: () => "md-file-" + MdUuid()
    },
    name: String
  },
  mixins: [MdFieldMixin],
  inject: ["MdField"],
  methods: {
    getMultipleName(files) {
      let names = [];

      [...files].forEach(({ name }) => names.push(name));

      return names.join(", ");
    },
    getFileName(files, target) {
      if (!files || files.length === 0) {
        return target.value.split("\\").pop();
      }

      if (files.length > 1) {
        return this.getMultipleName(files);
      }

      if (files.length === 1) {
        return files[0].name;
      }

      return null;
    },
    openPicker() {
      this.onFocus();
      this.$refs.inputFile.click();
    },
    onChange($event) {
      this.onFileSelected($event);
    },
    onFileSelected({ target, dataTransfer }) {
      const files = target.files || dataTransfer.files;
      this.files = Array.from(files);

      this.model = this.getFileName(files, target);
      this.$emit("md-change", files || target.value);
    }
  },
  watch: {
    localValue() {
      this.$emit("input", this.files);
    }
  },
  created() {
    this.MdField.file = true;
  },
  beforeDestroy() {
    this.MdField.file = false;
  },
  $_veeValidate: {
    name() {
      return this.name;
    },
    value() {
      return this.files;
    }
  }
};
</script>

<style lang="scss">
.md-file {
  display: flex;
  flex: 1;

  input[type="file"] {
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    position: absolute;
    clip: rect(0 0 0 0);
    border: 0;
  }

  .md-icon {
    cursor: pointer;
  }
}
</style>
