<template>
  <drop-down v-if="isInited">
    <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
      <i>{{ currentCur.symbol }}</i>
      <p>{{ $t("navbar.mainCurrency") }}: {{ currentCur.name }}</p>
    </a>
    <ul class="dropdown-menu dropdown-menu-right">
      <li v-for="cur in fiatCurs" :key="cur.id">
        <a href="#" @click.prevent="changeCur(cur)">{{ cur.name }}</a>
      </li>
    </ul>
  </drop-down>
</template>

<script>
import currencySelector from "@/mixins/currencySelector";

export default {
  name: "mobile-currency-selector",
  mixins: [currencySelector],
};
</script>
