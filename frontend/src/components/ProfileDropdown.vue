<template>
  <div class="dropdown-menu">
    <div class="d-flex align-items-center text-white word-break-all">
      <!-- The users avatar -->
      <div class="py-2 mx-2">
        <img
          class="profile-avatar"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPZQ_Z6Jir7-1quljeW8Nea3KQ3uXEVbtQ6w&usqp=CAU"
          alt=""
        />
      </div>
      <!-- Greet the user -->
      <div class="">
        <span>Hello {{ user.username }}</span>
      </div>
    </div>

    <div class="row row-cols-2 text-center">
      <router-link class="tile py-4 px-2 border-bottom border-end" :to="'/' + user.username"
        ><i class="fas fa-user-circle"></i><span class="d-block pt-1">My Profile</span></router-link
      >
      <router-link class="tile py-4 px-2 border-bottom" :to="'/' + user.username + '/settings'"
        ><i class="fas fa-cogs"></i><span class="d-block pt-1">Settings</span></router-link
      >
      <router-link class="tile py-4 px-2 border-end" to="#"
        ><i class="fas fa-bell"></i><span class="d-block pt-1">Notifications</span></router-link
      >
      <router-link class="tile py-4 px-2" @click="logout" to="">
        <i class="fas fa-sign-out-alt"></i><span class="d-block pt-1">Sign Out</span>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: Object,
  },
  data() {
    return {}
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push({ name: 'home', params: { redirectMsg: 'Successfully logged out!' } })
    },
  },
}
</script>

<style></style>
