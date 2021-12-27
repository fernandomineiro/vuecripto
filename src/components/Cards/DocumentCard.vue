<template>
  <div>
    <div class="md-layout" :class="`md-alignment-top-center`">
      <div class="md-layout-item md-size-100">
        <div class="md-layout" :class="`md-alignment-top-center`">
          <h3 class="title">{{ $t("wizard." + type) }}</h3>
        </div>
        <div
          v-if="type === 'nationalId'"
          class="md-layout"
          style="margin-top: -25px"
          :class="`md-alignment-top-center`"
        >
          <h5 class="subtitle">{{ $t("wizard.cnhId") }}</h5>
        </div>
      </div>
    </div>
    <div class="md-layout" :class="`md-alignment-center-center`">
      <div class="md-layout-item md-size-100">
        <div class="md-layout" :class="`md-alignment-center-center`">
          <h6 v-if="verse" class="category">{{ $t("wizard." + verse) }}</h6>
        </div>
        <div
          v-if="takingFile"
          class="md-layout"
          :class="`md-alignment-center-center`"
        >
          <md-content>
            <div class="md-layout" :class="`md-alignment-top-center`">
              <md-field>
                <label>{{ $t("wizard.fileInput") }}</label>
                <md-file type="file" @change="previewImage" />
              </md-field>
            </div>
          </md-content>
        </div>
        <div
          v-if="takingPhoto"
          class="md-layout"
          :class="`md-alignment-center-center`"
        >
          <web-cam
            :width="400"
            :height="250"
            v-if="takingPhoto"
            ref="webcam"
            :selectFirstDevice="true"
            class="video-mask md-small-hide"
            @cameras="loadCameras"
          />
          <md-button
            id="takeOnMobile"
            class="md-just-icon md-round md-fileinput upload-btn md-sm"
          >
            <md-icon>add_a_photo</md-icon>
            <input
              type="file"
              accept="image/*"
              capture="camera"
              @change="takePhoto"
            />
          </md-button>
        </div>
        <div
          v-if="!takingPhoto && !onlyFile"
          class="md-layout"
          :class="`md-alignment-center-center`"
        >
          <img
            v-if="isImage && !takingFile"
            :src="filePreview"
            class="max-image"
          />
        </div>
        <div
          v-if="!takingFile"
          class="md-layout"
          :class="`md-alignment-top-center`"
        >
          <md-button
            v-if="takingPhoto"
            @click="takePhotoOnDesktop"
            class="md-raised md-primary md-small-hide"
            >{{ $t("wizard.takePhoto") }}</md-button
          >
          <md-button
            v-if="!takingPhoto"
            @click="(takingPhoto = true), (proceed = true)"
            class="md-primary md-raised md-small-hide"
            >{{ $t("wizard.takeAnotherPhoto") }}
          </md-button>
          <md-button
            v-if="!takingPhoto"
            @click="(takingPhoto = true), (proceed = true)"
            id="takeOnMobile"
            class="md-primary md-fileinput upload-btn md-sm"
            >{{ $t("wizard.takeAnotherPhoto") }}
            <input
              type="file"
              accept="image/*"
              capture="camera"
              @change="takePhoto"
            />
          </md-button>
        </div>
        <div class="md-layout" :class="`md-alignment-top-center`">
          <md-list-item
            exact
            to="#"
            v-if="!takingFile && takingPhoto && !onlyFile"
            @click="(takingPhoto = false), (takingFile = true)"
          >
            {{ $t("wizard.chooseFile") }}
          </md-list-item>
          <md-list-item
            exact
            to="#"
            v-if="!takingPhoto && takingFile && !onlyFile"
            @click="(takingPhoto = true), (takingFile = false)"
          >
            {{ $t("wizard.chooseWebcam") }}
          </md-list-item>
        </div>
        <div class="md-layout" :class="`md-alignment-top-center`">
          <div v-if="!onlyFile">
            <p class="md-title">{{ $t("wizard.attetionTo") }}</p>
            <p class="md-body-1">{{ $t("wizard.itemIsClear") }}</p>
            <p class="md-body-1">{{ $t("wizard.itemIsLarge") }}</p>
            <p class="md-body-1">{{ $t("wizard.itemLookLikeId") }}</p>
          </div>
          <div v-else>
            <p class="md-title">{{ $t("wizard.attetionTo") }}</p>
            <p class="md-body-1">{{ $t("wizard.pdfIsClear") }}</p>
            <p class="md-body-1">{{ $t("wizard.pdfData") }}</p>
          </div>
        </div>
        <div class="md-layout" :class="`md-alignment-center-center`">
          <md-button
            :disabled="proceed"
            @click="sendToVerify"
            class="md-raised md-primary"
            >{{ $t("wizard.proceedButton") }}</md-button
          >
        </div>
      </div>
    </div>
    <md-progress-bar v-if="sending" md-mode="indeterminate"></md-progress-bar>
  </div>
</template>

<script>
import { WebCam } from "vue-web-cam";
import documentsAPI from "@/api/documents";
import types from "@/utils/documentTypes";

export default {
  name: "document-card",
  components: {
    WebCam
  },
  props: {
    type: { type: String },
    verse: { type: String, default: "" },
    steps: { type: Array, default: null },
    documentFile: {
      type: Object,
      default: function() {
        return null;
      }
    },
    documentType: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },
  data() {
    return {
      filePreview: null,
      takingPhoto: true,
      takingFile: false,
      isImage: true,
      camRender: 0,
      proceed: true,
      sending: false,
      onlyFile: false,
      document: {
        file: null
      }
    };
  },
  created() {
    if (this.documentType) {
      if (
        this.documentType.id === types[2].id ||
        this.documentType.id === types[3].id ||
        this.documentType.id === types[4].id
      ) {
        this.takingPhoto = false;
        this.isImage = false;
        this.takingFile = true;
        this.onlyFile = true;
      }
      this.document.description = this.type + "_" + this.verse;
      this.document.document_type_id = this.documentType.id;
      if (this.verse !== "") this.document.page = this.setPage(this.verse);
    }
  },
  methods: {
    previewImage(e) {
      this.document.file = e.target.files[0];
      if (e.target.files[0]) {
        this.isImage = this.document.file.type !== "application/pdf";
        if (this.isImage) {
          this.filePreview = URL.createObjectURL(this.document.file);
        }
        this.proceed = false;
      } else {
        this.filePreview = null;
        this.proceed = true;
      }
    },
    sendToVerify() {
      this.sending = true;
      if (this.documentFile) {
        documentsAPI
          .UpdateDocument(
            this.documentFile.id,
            this.getFormData(this.document))
          .then(() => {
            this.sending = false;
            this.proceedToNextStep();
          })
          .catch(err => console.error(err));
      } else {
        documentsAPI
          .AddNew(this.getFormData(this.document))
          .then(() => {
            this.sending = false;
            this.proceedToNextStep();
          })
          .catch(() => {
            this.sending = false;
            this.$notify({
              message: this.$t("error") + " - " + this.$t("allowedImageFiles"),
              icon: "error",
              horizontalAlign: "center",
              verticalAlign: "top",
              type: "danger"
            });
          });
      }
    },
    setPage(verse) {
      if (verse === "uploadFrontSide") return "front";
      if (verse === "uploadBackSide") return "back";
    },
    getFormData(object) {
      const formData = new FormData();
      Object.keys(object).forEach(key => formData.append(key, object[key]));
      return formData;
    },
    proceedToNextStep() {
      this.$emit("set-done", this.steps[0], this.steps[1]);
    },
    takePhoto(e) {
      this.document.file = e.target.files[0];
      this.filePreview = URL.createObjectURL(this.document.file);
      this.takingPhoto = false;
      this.takingFile = false;
      this.proceed = false;
      this.isImage = true;
    },
    takePhotoOnDesktop() {
      this.document.file = this.convertBase64ToBlob(
        this.$refs.webcam.capture()
      );
      this.filePreview = URL.createObjectURL(this.document.file);
      this.takingPhoto = false;
      this.takingFile = false;
      this.proceed = false;
      this.isImage = true;
    },
    convertBase64ToBlob(base64Image) {
      const parts = base64Image.split(";base64,");
      const imageType = parts[0].split(":")[1];
      const decodedData = window.atob(parts[1]);
      const uInt8Array = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: imageType });
    },
    loadCameras(cameras) {
      let cameraId = cameras[0].deviceId;
      if (cameraId) this.$refs.webcam.changeCamera(cameras[0].deviceId);
      else {
        this.takingPhoto = false;
        this.takingFile = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.max-image {
  min-width: 37%;
  min-height: 20%;
  max-width: 37%;
  max-height: 20%;
  transform: scaleX(-1);
}

.video-mask {
  width: 400px;
  height: 230px;
  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
}

video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

#takeOnMobile {
  display: none;
}

@media screen and (max-width: 600px) {
  #takeOnMobile {
    display: block;
  }

  video {
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
  }

  .max-image {
    min-width: 230px;
    min-height: 400px;
    max-width: 230px;
    max-height: 400px;
    transform: scaleX(1);
  }
}
</style>
