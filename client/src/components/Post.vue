<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between">
        <h4>{{ post.title }}</h4>

        <!-- Wrapper -->
        <div v-if="checkSameUser()" v-click-outside="hideDropdown" class="position-relative">
          <button @click="dropdownHidden = !dropdownHidden" class="btn btn-icon" :class="{ active: !dropdownHidden }">
            <i class="fas fa-ellipsis-v"></i>
          </button>

          <Dropdown :dropdownHidden="dropdownHidden">
            <div class="p-1">
              <button @click="deletePost" class="btn btn-option"><i class="fas fa-trash"></i>Delete post</button>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="card-body">
      <p>{{ post.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['onpostsupdate'],
  data() {
    return {
      dropdownHidden: true,
    }
  },

  props: {
    post: Object,
  },

  methods: {
    hideDropdown() {
      this.dropdownHidden = true
    },

    async deletePost() {
      this.hideDropdown()

      await fetch(process.env.VUE_APP_API_BASE_URL + '/posts/' + this.post.id, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `bearer ${this.$store.getters['user/accessToken']}`,
          'Content-Type': 'application/json',
        },
      })

      this.$emit('onpostsupdate')
    },

    checkSameUser() {
      return this.$route.params.username === this.$store.getters['user/user'].username ? true : false
    },
  },
}
</script>

<style></style>
