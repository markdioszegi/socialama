<template>
  <ul :class="`pagination ${isLarge ? 'pagination-lg' : ''}`">
    <li :class="`page-item ${currentPage == 1 ? 'disabled' : ''}`">
      <a @click="changePage(currentPage > 1 ? currentPage - 1 : currentPage)" class="page-link" tabindex="-1"
        ><i class="fas fa-arrow-left"></i
      ></a>
    </li>

    <li
      v-for="(page, index) in totalPages"
      :key="index"
      :class="`page-item ${index + 1 == currentPage ? 'active' : ''}`"
    >
      <a class="page-link" @click="changePage(index + 1)">{{ index + 1 }}</a>
    </li>

    <li :class="`page-item ${currentPage == totalPages ? 'disabled' : ''}`">
      <a @click="changePage(currentPage < totalPages ? currentPage + 1 : currentPage)" class="page-link"
        ><i class="fas fa-arrow-right"></i
      ></a>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      ignoreRouteChange: false,
    }
  },

  props: {
    isLarge: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
    },
    totalPages: {
      type: Number,
    },
  },

  created() {
    this.changePage(Number(this.$route.query.pageNumber) || this.currentPage)
  },

  methods: {
    changePage(newPage) {
      //console.log(this.currentPage + ' | ' + newPage)
      this.$emit('onpagechanged', newPage)
      this.ignoreRouteChange = true
      // change query
      this.$router
        .push({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            pageNumber: newPage,
          },
        })
        .then(() => (this.ignoreRouteChange = false))
    },
  },

  watch: {
    $route(to, from) {
      if (!this.ignoreRouteChange)
        if (to.name === from.name) {
          this.changePage(Number(this.$route.query.pageNumber || from.query.pageNumber))
        }
    },
  },
}
</script>

<style></style>
