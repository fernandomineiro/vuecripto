<template>
  <div class="md-layout text-center">
    <div class="md-card term-card">
      <a :href="homeUrl">
        <img class="cda-logo" src="/img/CDA-logo.png" />
      </a>
      <h1 class="text-center term-title">{{ $t("terms.user") }}</h1>
      <div class="text-plain">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Ea beatae expedita pariatur dolore accusamus voluptatibus in 
          enim temporibus laborum error neque ipsa vitae delectus dolor 
          cum nesciunt, animi doloremque modi!
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          Consequuntur fuga distinctio repellendus totam. Molestiae delectus, 
          enim nostrum eos cum labore nesciunt facilis eligendi velit, 
          est earum architecto fuga voluptatum quibusdam.
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
          Consequuntur fuga distinctio repellendus totam. Molestiae delectus, 
          enim nostrum eos cum labore nesciunt facilis eligendi velit, est earum 
          architecto fuga voluptatum quibusdam.
        </p>
      </div>
      <md-button class="md-info" @click="goToHome">
        {{ $t("backToHome") }}
      </md-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    goToHome() {
      this.$router.push("/");
    }
  },
  computed: {
    homeUrl() {
      return process.env.VUE_APP_FRONT_URL || "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/md/_variables";

.term-card {
  width: 90%;
  padding: 0 1rem;
}
.term-title {
  margin-top: 0.5rem;
  margin-bottom: 0;
}
.text-plain {
  text-align: left;
}
.cda-logo {
  width: 50%;
  margin: 0 auto;
  margin-top: 1rem;
}

@media (min-width: $screen-md) {
  .term-card {
    width: 60%;
  }
}

@media (min-width: 1600px) {
  .term-card {
    width: 1000px;
  }
}
</style>
