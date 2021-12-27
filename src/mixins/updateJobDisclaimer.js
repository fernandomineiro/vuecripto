import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      userJob: state =>
        state.Profiles.profile ? state.Profiles.profile.job : null,
      profileStatus: state => state.Profiles.status
    }),
    hasJob() {
      return (
        ["pristine", "fetching"].includes(this.profileStatus) ||
        (this.profileStatus == "set" && !!this.userJob)
      );
    }
  }
};
