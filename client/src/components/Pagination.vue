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
    return {}
  },
  props: {
    isLarge: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
  },

  methods: {
    changePage(newPage) {
      if (this.currentPage != newPage) this.$emit('page-changed', newPage)

      this.$router.push({
        path: this.$route.path,
        query: {
          pageNumber: newPage,
        },
      })
    },
  },

  watch: {
    $route() {
      this.changePage(Number(this.$route.query.pageNumber))
      console.log('route changed')
    },
  },
}
</script>

<style></style>
