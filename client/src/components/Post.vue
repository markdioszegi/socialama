<template>
  <div class="card" :class="{ editing: editing }">
    <div class="card-header">
      <div>
        <!-- Editing section -->
        <div class="d-flex justify-content-between" v-if="editing">
          <input v-model="editedPost.title" type="text" :placeholder="post.title" />
        </div>

        <!-- View section -->
        <div class="d-flex justify-content-between word-break-all" v-if="!editing">
          <h4>{{ post.title }}</h4>

          <!-- Wrapper -->
          <div v-if="checkSameUser()" v-click-outside="hideDropdown" class="position-relative">
            <button @click="dropdownHidden = !dropdownHidden" class="btn btn-icon" :class="{ active: !dropdownHidden }">
              <i class="fas fa-ellipsis-v"></i>
            </button>

            <Dropdown :dropdownHidden="dropdownHidden">
              <div class="p-1">
                <button @click="editPost" class="btn btn-option"><i class="fas fa-edit"></i>Edit post</button>
                <button @click="deletePost" class="btn btn-option"><i class="fas fa-trash"></i>Delete post</button>
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div v-if="editing">
        <textarea v-model="editedPost.text" class="w-100" :placeholder="post.text" />

        <!-- Wrapper -->
        <div class="text-right">
          <button @click="discardChanges" class="btn btn-outline-danger">Discard changes</button>
          <button @click="sendEditedPost" class="btn btn-success">Apply changes</button>
        </div>
      </div>
      <div v-if="!editing">
        <p>{{ post.text }}</p>
      </div>

      <!-- Show errors if any -->
      <transition name="dropdown">
        <Error v-if="errors" :errors="errors" />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['onpostsupdate', 'onunsavedchanges'],
  data() {
    return {
      dropdownHidden: true,
      editing: false,
      editedPost: {},
      errors: null,
    }
  },

  props: {
    post: Object,
  },

  methods: {
    hideDropdown() {
      this.dropdownHidden = true
    },

    async editPost() {
      this.hideDropdown()

      this.editing = true
      this.$emit('onunsavedchanges')
    },

    async sendEditedPost() {
      await fetch(process.env.VUE_APP_API_BASE_URL + '/posts/' + this.post.id, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Authorization: `bearer ${this.$store.getters['user/accessToken']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.editedPost),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.errors) {
            this.errors = data.errors
          } else {
            this.editing = false
            this.errors = null
          }
        })

      this.$emit('onpostsupdate')
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

    discardChanges() {
      this.editing = false
      this.errors = null
    },

    checkSameUser() {
      return this.$route.params.username === this.$store.getters['user/user'].username ? true : false
    },
  },
}
</script>

<style></style>
