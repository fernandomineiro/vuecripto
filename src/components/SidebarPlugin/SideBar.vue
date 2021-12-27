<template>
  <div
    class="sidebar"
    :data-color="activeColor"
    :data-image="backgroundImage"
    :data-background-color="backgroundColor"
    :style="sidebarStyle"
  >
    <div class="logotipo">
      <div class="logo-icon">
        <img :src="logo" />
      </div>
    </div>
    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <slot></slot>
      <md-list class="nav">
        <slot name="links">
          <sidebar-item
            v-for="(link, index) in sidebarLinks"
            :key="link.name + index"
            :link="link"
          >
            <sidebar-item
              v-for="(subLink, index) in link.children"
              :key="subLink.name + index"
              :link="subLink"
            >
            </sidebar-item>
          </sidebar-item>
        </slot>
      </md-list>
    </div>
  </div>
</template>
<script>
export default {
  name: "sidebar",
  props: {
    title: {
      type: String,
      default: "Vue MD PRO"
    },
    rtlTitle: {
      type: String,
      default: "توقيت الإبداعية"
    },
    activeColor: {
      type: String,
      default: "green",
      validator: value => {
        let acceptedValues = [
          "",
          "purple",
          "azure",
          "green",
          "orange",
          "danger",
          "rose"
        ];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    backgroundImage: {
      type: String,
      default: "./img/1.jpg"
    },
    backgroundColor: {
      type: String,
      default: "black",
      validator: value => {
        let acceptedValues = ["", "black", "white", "red"];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    logo: {
      type: String,
      default: "./img/vue-logo.png"
    },
    sidebarLinks: {
      type: Array,
      default: () => []
    },
    autoClose: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  methods: {
    minimizeSidebar() {
      if (this.$sidebar) {
        this.$sidebar.toggleMinimize();
      }
    }
  },
  computed: {
    sidebarStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`
      };
    }
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
    }
  }
};
</script>
<style>
@media (min-width: 992px) {
  .navbar-search-form-mobile,
  .nav-mobile-menu {
    display: none;
  }
}
.logotipo {
  width: 100%;
  height: 100px;
  z-index: 9999;
  position: relative;
  display: flex;
  justify-content: center;
}
.logo-icon {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
}
</style>
