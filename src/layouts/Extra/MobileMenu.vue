<template>
  <ul class="nav nav-mobile-menu">
    <li>
      <mobile-user-menu />
    </li>
  </ul>
</template>

<script>
import MobileUserMenu from "@/components/MobileUserMenu";

export default {
  name: "mobile-menu",
  components: {
    MobileUserMenu
  }
};
</script>
