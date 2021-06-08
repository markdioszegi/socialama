<template>
  <!-- Check if we are able to edit the post -->
  <div v-if="checkSameUser" class="card editing">
    <div class="card-header">
      <h3>Edit post</h3>
    </div>
    <form @submit.prevent class="d-flex justify-content-center">
      <div class="card-body w-100">
        <!-- Show errors if any -->
        <transition name="dropdown">
          <Error v-if="errors" :errors="errors" />
        </transition>
        <h2 v-if="redirectMsg" class="text-success">{{ redirectMsg }}</h2>

        <!-- Title section -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Title</label>
          <div class="col-9">
            <input v-model="editedPost.title" placeholder="Title" class="form-control" type="text" />
          </div>
        </div>
        <!-- Text section -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Text</label>
          <div class="col-9">
            <textarea
              :maxlength="$post.maxLen"
              v-model="editedPost.text"
              placeholder="Write your thoughts..."
              class="form-control"
            />
            <div class="text-right">
              <small>{{ currentTextLen }} / {{ $post.maxLen }}</small>
            </div>
          </div>
        </div>
        <!-- Create post -->
        <div class="d-flex justify-content-center">
          <div class="mr-2">
            <button @click="discardChanges" class="btn btn-outline-danger">Discard changes</button>
          </div>
          <div>
            <button @click="sendEditedPost" class="btn btn-success">Apply changes</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  emits: ['oncloseediting'],
  data() {
    return {
      editedPost: { ...this.post },
      errors: null,
      redirectMsg: '',
    }
  },

  props: {
    post: Object,
  },

  methods: {
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
            this.errors = null
            this.$emit('oncloseediting')
          }
        })
    },

    discardChanges() {
      this.errors = null
      console.log(this.post);
      this.$emit('oncloseediting')
    },
  },

  computed: {
    // Check if the user viewing his own page(s)
    checkSameUser() {
      return this.$route.params.username === this.$store.getters['user/user'].username ? true : false
    },
    currentTextLen() {
      return this.post.text.length
    },
  },
}
</script>

<style></style>
