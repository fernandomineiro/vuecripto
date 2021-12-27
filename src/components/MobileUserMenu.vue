<template>
  <drop-down>
    <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
      <i v-if="user.id">
        <Avatar :user="user" class="mobile-user-avatar" :size="30" />
      </i>
      <i v-else>...</i>
      <p>
        {{ user.username }}
        <b class="caret"></b>
      </p>
    </a>
    <ul class="dropdown-menu dropdown-menu-right" @click="onMenuSelect">
      <li>
        <router-link to="/profile">
          {{ $t("navbar.profile") }}
        </router-link>
      </li>
      <li>
        <a href="#" @click.prevent="showPasswordModal">
          {{ $t("changePassword") }}
        </a>
      </li>
      <li>
        <router-link to="/configurations">
          {{ $t("navbar.options") }}
        </router-link>
      </li>
    </ul>
  </drop-down>
</template>

<script>
import Avatar from "@/components/Avatar";
import { mapState, mapActions } from "vuex";

export default {
  name: "mobile-user-menu",
  components: {
    Avatar
  },
  computed: {
    ...mapState({
      user: state => state.User
    })
  },
  methods: {
    ...mapActions({
      showPasswordModal: "Modals/launchChangePassword"
    }),
    onMenuSelect() {
      this.sidebarStore.displaySidebar(false);
    }
  }
};
</script>

<style>
.mobile-user-avatar {
  display: inline-block;
}
</style>
