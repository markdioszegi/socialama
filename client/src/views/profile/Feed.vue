<template>
  <h1 v-if="loading">loading...</h1>

  <h1 v-if="error" class="text-error">Couldn't find user {{ $route.params.username }}.</h1>

  <div v-if="!loading && !error" class="">
    <h1>You are viewing {{ user?.username }}'s profile page.</h1>

    <div v-if="user?.username === $store.getters['user/user'].username">
      <h1>This is your page!</h1>
    </div>

    <p v-for="(prop, name) in user" :key="name">{{ name }}: {{ prop }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      loading: true,
      error: false,
    }
  },
  mounted() {
    this.fetchUser()
  },

  watch: {
    async $route(from) {
      if (from.name === 'feed') await this.fetchUser()
    },
  },

  methods: {
    async fetchUser() {
      //console.log('Fired fetchdata on User')
      return await fetch(process.env.VUE_APP_API_BASE_URL + '/users?username=' + this.$route.params.username)
        .then((res) => res.json())
        .then((data) => {
          this.loading = false
          if (data.users[0]) {
            this.user = data.users[0]
            this.user.created_at = new Date(this.user.created_at).toString()
            this.user.updated_at = new Date(this.user.updated_at).toString()
            this.error = false
            return data.users[0]
          } else {
            this.error = true
            return null
          }
        })
    },
  },
}
</script>

<style></style>
