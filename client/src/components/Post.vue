<template>
  <div>
    <div v-if="!editing" class="card">
      <div class="card-header">
        <div>
          <!-- View section -->
          <div class="d-flex justify-content-between word-break-all">
            <h4>{{ post.title }}</h4>

            <!-- Wrapper -->
            <div v-if="checkSameUser()" v-click-outside="hideDropdown" class="position-relative">
              <button
                @click="dropdownHidden = !dropdownHidden"
                class="btn btn-icon"
                :class="{ active: !dropdownHidden }"
              >
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
        <p>{{ post.text }}</p>
      </div>
    </div>

    <EditPost :post="post" v-if="editing" @oncloseediting="discardChanges" />
  </div>
</template>

<script>
export default {
  emits: ['onpostsupdate', 'onunsavedchanges'],
  data() {
    return {
      dropdownHidden: true,
      editing: false,
      editedPost: this.post,
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
      //this.$emit('onunsavedchanges')
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
      this.$emit('onpostsupdate')
    },

    checkSameUser() {
      return this.$route.params.username === this.$store.getters['user/user'].username ? true : false
    },
  },
}
</script>

<style></style>
