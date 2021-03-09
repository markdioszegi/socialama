<template>
  <div class="navbar-wrapper">
    <nav class="navbar-expand-lg" :class="isSticky ? 'sticky' : ''">
      <div class="container d-flex align-items-center justify-content-between">
        <router-link to="/"><img class="navbar-logo" src="../assets/logo.png" alt="Logo"/></router-link>

        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fas fa-home icon"></i>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/users">
              <i class="fas fa-users icon"></i>
            </router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">
              <i class="fas fa-user icon"></i>
            </router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/register">
              <i class="fas fa-user icon"></i>
            </router-link>
          </li>
          <li v-click-outside="clickOutsideProfileMenu" v-if="isLoggedIn" class="nav-item">
            <button
              @click="showProfileMenu"
              class="profile-menu-link"
              :class="{ active: $route.path.includes('/' + user.username) }"
            >
              <i class="fas fa-user icon"></i>
            </button>
            <!-- <router-link @click="showProfileMenu = !showProfileMenu" class="nav-link" :to="'/' + user.username">
                <i class="fas fa-user icon"></i>
                <span> {{ user.username }}</span>
              </router-link> -->
            <transition name="dropdown">
              <ProfileDropdown :user="user" v-if="profileMenuVisible" />
            </transition>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import ProfileDropdown from './ProfileDropdown'

export default {
  components: { ProfileDropdown },
  data() {
    return {
      profileMenuVisible: false,
      isSticky: false,
    }
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    showProfileMenu() {
      this.profileMenuVisible = !this.profileMenuVisible
    },
    handleScroll() {
      if (pageYOffset > 200) {
        //window.scrollBy(0, -68)
        this.isSticky = true
      } else {
        this.isSticky = false
      }
    },
    clickOutsideProfileMenu() {
      this.profileMenuVisible = false
    },
  },
  watch: {
    $route() {
      // Hide the mobile menu and profile dropdown on route change
      this.profileMenuVisible = false
    },
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters['user/isAuthenticated']
    },
    user() {
      return this.$store.getters['user/user']
    },
  },
}
</script>

<style></style>
