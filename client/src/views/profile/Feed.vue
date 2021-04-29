<template>
  <h1 v-if="loading">loading...</h1>

  <h1 v-if="error" class="text-error">Couldn't find user {{ $route.params.username }}.</h1>

  <div v-if="!loading && !error" class="row">
    <!-- Root div -->
    <div class="col-3 p-1">
      <div class="card">
        <div class="px-2 py-1">
          <h1>You are viewing {{ user?.username }}'s profile page.</h1>

          <div v-if="user?.username === $store.getters['user/user'].username">
            <h1>This is your page!</h1>
          </div>

          <p v-for="(prop, name) in user" :key="name">{{ name }}: {{ prop }}</p>
        </div>
      </div>
    </div>

    <div class="col-9 p-1">
      <CreatePost class="mb-4" @onpostsupdate="fetchData" />

      <!-- <h1>Posts</h1> -->

      <transition-group name="dropdown">
        <div :post-id="post.id" v-for="post in posts" :key="post.id">
          <Post class="mb-2" :post="post" @onpostsupdate="fetchData" />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      loading: true,
      posts: null,
      error: null,
    }
  },

  mounted() {
    this.fetchData()
  },

  watch: {
    async $route(from) {
      if (from.name === 'feed') await this.fetchData()
    },
  },

  methods: {
    async fetchData() {
      console.log('Fetching data')
      // Fetch data
      await fetch(process.env.VUE_APP_API_BASE_URL + '/users?username=' + this.$route.params.username)
        .then((res) => res.json())
        .then((data) => {
          if (data.users[0]) {
            this.user = data.users[0]
            this.user.created_at = new Date(this.user.created_at).toString()
            this.user.updated_at = new Date(this.user.updated_at).toString()
            this.error = false
            this.loading = false
            return data.users[0]
          } else {
            this.error = true
            this.loading = false
            return null
          }
        })

      // Get posts
      await fetch(process.env.VUE_APP_API_BASE_URL + '/posts?user_id=' + this.user.id)
        .then((res) => res.json())
        .then((data) => {
          this.posts = data.posts
        })
    },
  },
}
</script>

<style></style>
