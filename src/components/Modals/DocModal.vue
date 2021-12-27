<template>
  <form @submit.prevent="submitDoc" autocomplete="off">
    <!-- Adding document -->
    <modal v-if="!(docId || alert)" @close="$emit('close')">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("add") }}
          {{ docTitle }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <md-field :class="{ 'md-error': errors.has('file') }">
          <input
            type="file"
            accept="image/*, .pdf"
            :placeholder="$t('allowedImageFiles')"
            name="file"
            v-validate="'required|ext:jpg,jpeg,png,pdf,bmp|size:67108864'"
            @change="handleFile"
          />
        </md-field>
        <md-field :class="{ 'md-error': errors.has('description') }">
          <label>{{ $t("description") }} ({{ $t("optional") }})</label>
          <md-input
            type="text"
            v-model="description"
            name="description"
            maxlength="255"
          ></md-input>
        </md-field>
        <div v-if="file && errors.has('file')">
          <md-icon class="text-warning">warning</md-icon>
          {{ validateFile(file) }}
        </div>
      </template>

      <sync-loader color="#999999" slot="footer" v-if="loading" class="mt-4" />
      <md-button
        class="md-danger md-block mt-4"
        type="submit"
        slot="footer"
        v-else
      >
        {{ $t("add") }}
      </md-button>
    </modal>

    <!-- Editing Document -->
    <modal v-if="docId && !alert" @close="$emit('close')">
      <template slot="header">
        <h4 class="modal-title">
          {{ $t("edit") }}
          {{ docTitle }}
        </h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="$emit('close')"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <md-field>
          <label>{{ $t("profile.documents.documentNo") }}</label>
          <md-input
            type="text"
            v-model="description"
            name="description"
          ></md-input>
        </md-field>
        <md-field :class="{ 'md-error': errors.has('file') }" md-inline>
          <input
            type="file"
            accept="image/*, .pdf"
            :placeholder="$t('allowedImageFiles')"
            name="file"
            v-validate="'ext:jpg,jpeg,png,pdf,bmp|size:67108864'"
            @change="handleFile"
          />
        </md-field>
        <div v-if="file && errors.has('file')">
          <md-icon class="text-warning">warning</md-icon>
          {{ validateFile(file) }}
        </div>
      </template>
      <sync-loader color="#999999" slot="footer" v-if="loading" />
      <md-button class="md-danger md-block" type="submit" slot="footer" v-else>
        {{ $t("edit") }}
      </md-button>
    </modal>
  </form>
</template>

<script>
import { Modal } from "@/components";
import SyncLoader from "vue-spinner/src/SyncLoader";
import documents from "@/api/documents";
import documentTypes from "@/utils/documentTypes";

export default {
  name: "doc-modal",
  components: {
    Modal,
    SyncLoader
  },
  props: {
    docType: {
      type: Object
    },
    docId: { type: [Number, Boolean], default: false }
  },
  data() {
    return {
      file: null,
      description: null,
      alert: false,
      loading: false,
      maxFileSize: 67108864
    };
  },
  computed: {
    docTitle() {
      const key = documentTypes.find(({ id }) => id === this.docType.id);
      return key ? this.$t(`profile.documents.type.${key.title}`) : "\u2014";
    }
  },
  methods: {
    handleFile(ev) {
      this.file = ev.target.files[0];
    },
    validateFile(file) {
      const res =
        file.size < this.maxFileSize // 64 MB == 67108864 Bytes
          ? this.$t("profile.documents.invalidFileType")
          : this.$t("profile.documents.invalidFileSize", { size: "64 MB" });

      return res;
    },
    async submitDoc() {
      if (this.docId) {
        // Updating document
        if (
          (await this.$validator.validate()) &&
          (this.file || this.description)
        ) {
          this.loading = true;
          documents
            .UpdateDocument(
              this.docId,
              this.description,
              this.file
            )
            .then(() => {
              this.$store.dispatch("Alerts/alertUser", {
                title: this.$t("success"),
                message: this.$t("profile.documents.updateSuccess")
              });
              this.$emit("close");
            })
            .catch(err => {
              this.alert = true;
              this.$store.dispatch("Alerts/alertUser", {
                title: this.$t("error"),
                message: this.$t(`api.documents.${err.statusString}`),
                onClose: () => (this.alert = false)
              });
            })
            .finally(() => (this.loading = false));
        } else {
          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t("verifyFormErrors"),
            onClose: () => (this.alert = false)
          });
        }
      } else {
        // Adding document
        if (
          (await this.$validator.validate()) &&
          (this.file || this.description)
        ) {
          this.loading = true;
          documents
            .AddNew(
              this.docType.id,
              this.description,
              this.file,
              this.$store.state.ActiveSession.token
            )
            .then(() => {
              this.$store.dispatch("Alerts/alertUser", {
                title: this.$t("success"),
                message: this.$t("profile.documents.addSuccess")
              });
              this.$emit("close");
            })
            .catch(err => {
              this.alert = true;
              this.$store.dispatch("Alerts/alertUser", {
                title: this.$t("error"),
                message: this.$t(`api.documents.${err.statusString}`),
                onClose: () => (this.alert = false)
              });
            })
            .finally(() => (this.loading = false));
        } else {
          this.alert = true;
          this.$store.dispatch("Alerts/alertUser", {
            title: this.$t("error"),
            message: this.$t("verifyFormErrors"),
            onClose: () => (this.alert = false)
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.md-field.md-error input[type="file"] {
  color: red;
}
</style>
