<template>
  <div class="card">
    <div class="card-header">
      <h3>Users</h3>
    </div>
    <div class="card-body">
      <div class="table-responsive">
        <div v-if="loading" class="">Loading...</div>

        <table v-if="!loading">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Active?</th>
            <th>TokenVersion</th>
          </tr>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.isActive }}</td>
            <td>{{ user.tokenVersion }}</td>
          </tr>
        </table>
        
        <div class="d-flex justify-content-center">
          <Pagination
            :isLarge="true"
            :currentPage="currentPage"
            :totalPages="totalPages"
            :perPage="perPage"
            @onpagechanged="onPageChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      users: [],
      metaTag: null,
      currentPage: 1,
      perPage: 10,
      totalPages: null,
    }
  },

  methods: {
    onPageChanged(pageNumber) {
      //console.log(pageNumber)
      this.currentPage = pageNumber
      this.fetchData()
    },

    fetchData() {
      this.loading = true
      //console.log('Fetching...')
      fetch(process.env.VUE_APP_API_BASE_URL + `/users?page=${this.currentPage}&limit=${this.perPage}`, {
        method: 'get',
        credentials: 'include',
        headers: { Authorization: `bearer ${this.$store.state.accessToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          this.users = data.users
          this.totalPages = data.totalPages
          this.loading = false
          //console.log(data)
        })
        .catch((err) => console.log(err.message))
    },
  },
}
</script>

<style lang="scss" scoped></style>
