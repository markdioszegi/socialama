<template>
  <div class="card">
    <div class="card-header">
      <h1>Account settings</h1>
    </div>
    <form @submit.prevent class="d-flex justify-content-center mw-settings">
      <div class="card-body">
        <!-- Show errors if any -->
        <Error v-if="errors" :errors="errors" />
        <h2 v-if="redirectMsg" class="text-success">{{ redirectMsg }}</h2>

        <!-- Change username -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Username</label>
          <div class="col-9">
            <input v-model="creds.username" class="form-control" type="text" />
          </div>
        </div>
        <!-- Email section -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Email</label>
          <div class="col-9">
            <input :value="this.$store.getters['user/user'].email" class="form-control" type="text" disabled />
          </div>
        </div>
        <!-- Change password -->
        <div class="row mb-3">
          <label class="col-3 text-bold">Change password</label>
          <div class="col-9">
            <div class="row mb-2">
              <label class="col-3">Old password</label>
              <div class="col-9 position-relative">
                <input v-model="creds.oldPassword" class="form-control" :type="type" placeholder="Old pw" />
                <i class="form-password" v-if="passwordVisible" @click="showPassword" :class="passwordIcon"></i>
              </div>
            </div>
            <div class="row">
              <label class="col-3">New password</label>
              <div class="col-9">
                <input v-model="creds.newPassword" class="form-control" :type="type" placeholder="New pw" />
              </div>
            </div>
          </div>
        </div>
        <!-- Deactivate account -->
        <div class="row mb-3">
          <label class="col-3"></label>
          <div class="col-9">
            <button @click="toggleDeactivationModal" class="btn btn-danger">Deactivate my account</button>
          </div>
        </div>
        <!-- Submit changes -->
        <div class="row mb-3">
          <label class="col-3"></label>
          <div class="col-9">
            <button @click="toggleSubmitModal" class="btn btn-success">Submit changes</button>
          </div>
        </div>
        <!-- Submit Modal -->
        <Modal
          @showModal="toggleSubmitModal"
          @modalConfirmed="sendEdit"
          v-if="submitModalVisible"
          headerText="Submit changes"
          bodyText="Are you sure you want to change?"
        />
        <!-- Deactivation Modal -->
        <Modal
          @showModal="toggleDeactivationModal"
          @modalConfirmed="deactivateAccount"
          v-if="deactivationModalVisible"
          headerText="Account deactivation"
          bodyText="Are you sure you want to deactivate your account?"
        />
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      submitModalVisible: false,
      deactivationModalVisible: false,
      confirmed: false,
      creds: {
        username: this.$store.getters['user/user'].username,
        oldPassword: '',
        newPassword: '',
      },
      errors: null,
      redirectMsg: '',

      type: 'password',
      passwordIcon: 'fas fa-eye',
      passwordVisible: false,
    }
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters['user/isAuthenticated']
    },
    user() {
      return this.$store.getters['user/user']
    },
  },
  methods: {
    showPassword() {
      if (this.type === 'password') {
        this.type = 'text'
        this.passwordTooltip = 'Hide password'
        this.passwordIcon = 'fas fa-eye-slash'
      } else {
        this.type = 'password'
        this.passwordTooltip = 'Show password'
        this.passwordIcon = 'fas fa-eye'
      }
    },
    toggleSubmitModal() {
      this.submitModalVisible = !this.submitModalVisible
    },
    toggleDeactivationModal() {
      this.deactivationModalVisible = !this.deactivationModalVisible
    },
    sendEdit() {
      //console.log(this.creds)
      this.$store.dispatch('user/edit', this.creds).then((res) => {
        if (res.errors) {
          this.success = false
          this.errors = res.errors
        } else {
          this.errors = null
          this.success = true
          setTimeout(() => {
            this.$router.push({
              path: `/${this.$store.getters['user/user'].username}/settings`,
              query: {
                redirectMsg: 'Account details updated',
              },
            })
            console.log('Redirecting ..')
          }, 1000)
        }
      })
    },
    deactivateAccount() {
      console.log('Deactivation sent!')
    },
  },
  watch: {
    creds: {
      handler(val) {
        if (val.oldPassword.length != 0 || val.newPassword.length != 0) {
          this.passwordVisible = true
        } else {
          this.passwordVisible = false
        }
      },
      deep: true,
    },
  },
}
</script>

<style></style>
