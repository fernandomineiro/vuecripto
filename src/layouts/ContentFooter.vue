<template>
  <footer class="footer">
    <div class="container md-offset">
      <nav>
        <ul>
          <li>
            <a :href="termsOfUse" target="_blank" class="footer-icon">
              {{ $t("footer.TOS") }}
            </a>
          </li>
          <li>
            <a :href="privacyPolicy" target="_blank" class="footer-icon">
              {{ $t("footer.privacyPolicy") }}
            </a>
          </li>
          <li>
            <a :href="blog" class="footer-icon">
              {{ $t("footer.blog") }}
            </a>
          </li>
<!--          <li>-->
<!--            <a :href="facebook">-->
<!--              <md-icon md-src="./icon/facebook.svg" />-->
<!--            </a>-->
<!--          </li>-->
          <li>
            <a :href="twitter" class="footer-icon">
              <md-icon md-src="./icon/twitter.svg" />
            </a>
          </li>
          <li>
            <a :href="telegram" class="footer-icon">
              <md-icon md-src="./icon/telegram.svg" />
            </a>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; {{ new Date().getFullYear() }} {{ companyName }}
      </div>
      <cookie-law theme="dark-lime">
        <div slot-scope="props">
          <button class="skew" @click="props.accept"><span>{{ $t("cookies.iAccept") }}</span></button>
          <p>
            <a :href="privacyPolicy" target="_blank">
              {{ $t("cookies.consent") }}
            </a>
          </p>
          <button class="skew" @click="props.close"><span>{{ $t("cookies.ignore") }}</span></button>
        </div>
      </cookie-law>
    </div>
  </footer>
</template>
<script>
import CookieLaw from "vue-cookie-law";
export default {
  components: { CookieLaw },
  computed:{
    companyName(){
      return process.env.VUE_APP_COMPANY_NAME;
    },
    facebook(){
      return process.env.VUE_APP_FB_SOCIAL;
    },
    instagram(){
      return process.env.VUE_APP_IG_SOCIAL;
    },
    twitter(){
      return process.env.VUE_APP_TWT_SOCIAL;
    },
    blog(){
      return process.env.VUE_APP_BLOG_SOCIAL;
    },
    telegram(){
      return process.env.VUE_APP_TELEGRAM_SOCIAL;
    },
    privacyPolicy(){
      return "/document/politica_de_privacidade.pdf";
    },
    termsOfUse(){
      return "/document/termos_de_uso.pdf";
    }
  }
};
</script>

<style>
.footer {
  padding: 0;
}
.md-svg-loader {
  display: inline-flex;
}
</style>

<style scoped>
.footer-icon:hover {
  color: #fff !important;
}
.main-panel .footer-icon:hover {
  color: rgb(60, 72, 88) !important;
}
</style>
