<template>
  <drop-down>
    <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
      <i
        class="material-icons flag-icon"
        :class="`flag-icon-${currentLang.flag}`"
      ></i>
      <p>{{ $t("navbar.language") }}: {{ currentLang.name }}</p>
    </a>
    <ul class="dropdown-menu dropdown-menu-right">
      <li v-for="lang in languages" :key="lang.id">
        <a href="#" @click.prevent="changeLang(lang)">
          <span class="flag-icon" :class="`flag-icon-${lang.flag}`"></span>
          {{ lang.name }}
        </a>
      </li>
    </ul>
  </drop-down>
</template>

<script>
import langSelector from "@/mixins/langSelector";

export default {
  name: "mobile-lang-selector",
  mixins: [langSelector]
};
</script>

<style scoped>
span.flag-icon {
  margin-right: 0.5rem;
}
</style>
