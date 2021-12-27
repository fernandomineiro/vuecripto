<template>
  <div>
    <div :class="{ 'avatar-box': editable }">
      <img
        v-if="!loading"
        :src="avatar"
        ref="avatar"
        class="user-avatar"
        :style="`width:${size}px; height:${size}px`"
      />
      <md-button
        v-if="editable && !loading"
        class="md-just-icon md-round md-fileinput upload-btn md-sm"
      >
        <md-icon>add_a_photo</md-icon>
        <input type="file" name="circle" @change="onFileChange" />
      </md-button>
    </div>
    <div>
      <SyncLoader v-if="editable && avatarUploading" color="#999999" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import avatarApi from "@/api/avatar";
import SyncLoader from "vue-spinner/src/SyncLoader";

export default {
  name: "gravatar",
  props: {
    user: { type: Object, required: true },
    size: { type: Number, default: 32 },
    display: { type: String, default: "mobile" },
    editable: { type: Boolean, default: false }
  },
  components: {
    SyncLoader
  },
  data() {
    return {
      avatarUploading: false
    };
  },
  computed: {
    ...mapState({
      avatar: state => state.Avatar.url,
      loading: state => state.Avatar.loading
    })
  },
  methods: {
    ...mapActions({
      alertUser: "Alerts/alertUser",
      fetchAvatar: "Avatar/fetchAvatar"
    }),
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
      this.uploadAvatar(files[0]);
    },
    async uploadAvatar(files) {
      this.avatarUploading = true;
      try {
        await avatarApi.upload(files);
        this.fetchAvatar();
      } catch (err) {
        this.alertUser({
          title: this.$t("error"),
          message: this.$t(`api.avatar.${err.statusString}`)
        });
      } finally {
        this.avatarUploading = false;
      }
    },
    createImage(file) {
      let reader = new FileReader();
      let vm = this;
      reader.readAsDataURL(file);
    }
  }
};
</script>

<style scoped>
.user-avatar {
  border-radius: 50%;
  object-fit: cover;
  object-position: 50% 0;
}
.upload-btn {
  right: 15px;
}
.avatar-box {
  margin-left: 2.8rem;
}
</style>
