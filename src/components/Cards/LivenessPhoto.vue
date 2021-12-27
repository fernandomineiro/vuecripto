<template>
  <div>
    <div class="md-layout" :class="`md-alignment-top-center`">
      <div class="md-layout-item md-size-100">
        <div class="md-layout" :class="`md-alignment-top-center`">
          <h3 class="title">{{ $t("wizard." + type) }}</h3>
        </div>
        <div class="md-layout" :class="`md-alignment-top-center`">
          <div class="md-layout" :class="`md-alignment-top-center`">
            <web-cam
              class="video-mask md-small-hide"
              :width="300"
              :height="300"
              v-if="takingPhoto"
              ref="webcam"
              :selectFirstDevice="true"
              @cameras="changeCameraSelfie"
            />
            <md-button
              v-if="takingPhoto"
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
            <img v-if="!takingPhoto" class="max-image" :src="imagePreview" />
          </div>
        </div>
        <div class="md-layout" :class="`md-alignment-top-center`">
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
          <div>
            <p class="md-title">{{ $t("wizard.attetionTo") }}</p>
            <p class="md-body-1">{{ $t("wizard.itemIsClear") }}</p>
            <p class="md-body-1">{{ $t("wizard.faceIsClear") }}</p>
            <p class="md-body-1">{{ $t("wizard.glassesOff") }}</p>
          </div>
        </div>
        <div class="md-layout" :class="`md-alignment-top-center`">
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
export default {
  name: "liveness-photo",
  components: {
    WebCam
  },
  props: {
    steps: { type: Array, default: null },
    type: { type: String },
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
      imagePreview: null,
      takingPhoto: true,
      proceed: true,
      sending: false,
      document: {
        file: null
      }
    };
  },
  created() {
    this.document.description = this.type;
    this.document.document_type_id = this.documentType.id;
  },
  methods: {
    previewImage(e) {
      this.document.file = e.target.files[0];
      this.imagePreview = URL.createObjectURL(this.document.file);
    },
    sendToVerify() {
      this.sending = true;
      if (this.documentFile) {
        documentsAPI
          .UpdateDocument(
            this.documentFile.id,
            this.getFormData(this.document)
          )
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
      this.imagePreview = URL.createObjectURL(this.document.file);
      this.takingPhoto = false;
      this.takingFile = false;
      this.proceed = false;
      this.isImage = true;
    },
    takePhotoOnDesktop() {
      this.document.file = this.convertBase64ToBlob(
        this.$refs.webcam.capture()
      );
      this.imagePreview = URL.createObjectURL(this.document.file);
      this.takingPhoto = false;
      this.takingFile = false;
      this.proceed = false;
      this.isImage = true;
    },
    convertBase64ToBlob(base64Image) {
      const parts = base64Image.split(";base64,");
      const imageType = parts[0].split(":")[1];
      const decodedData = window.atob(
        parts[1].replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
      );
      const uInt8Array = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: imageType });
    },
    changeCameraSelfie(cameras) {
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
  min-width: 400px;
  min-height: 400px;
  max-width: 400px;
  max-height: 400px;
  transform: scaleX(-1);
  border-radius: 50%;
  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
  object-fit: cover;
}

.video-mask {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
}

video {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  border-radius: 50%;
  object-fit: cover;
}

#takeOnMobile {
  display: none;
}

@media screen and (max-width: 600px) {
  #takeOnMobile {
    display: block;
  }

  video {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
  }

  .max-image {
    min-width: 240px;
    min-height: 240px;
    max-width: 240px;
    max-height: 240px;
    transform: scaleX(-1);
    border-radius: 50%;
    -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%);
    object-fit: cover;
  }
}
</style>
