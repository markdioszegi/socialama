<template>
  <div class="card">
    <div class="card-header">
      <h1>Account settings</h1>
    </div>
    <!-- Change username -->
    <form class="d-flex justify-content-center mw-settings">
      <div class="card-body">
        <div class="row mb-3">
          <label class="col-3 text-bold">Username</label>
          <div class="col-9">
            <input class="form-control" type="text" :value="user.username" />
          </div>
        </div>
        <!-- Change password -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Change password</label>
          <div class="col-9">
            <div class="row mb-2">
              <label class="col-3">Old password</label>
              <div class="col-9">
                <input class="form-control" type="text" placeholder="Old pw" />
              </div>
            </div>
            <div class="row">
              <label class="col-3">New password</label>
              <div class="col-9">
                <input class="form-control" type="text" placeholder="New pw" />
              </div>
            </div>
          </div>
        </div>
        <!-- Deactivate account -->
        <div class="row mb-3">
          <label class="col-3"></label>
          <div class="col-9">
            <button class="btn btn-danger">Deactivate my account</button>
          </div>
        </div>
        <!-- Submit changes -->
        <div class="row mb-3">
          <label class="col-3"></label>
          <div class="col-9">
            <button class="btn btn-success">Submit changes</button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters['user/isAuthenticated']
    },
    user() {
      return this.$store.getters['user/user']
    },
  },
}
</script>

<style></style>
