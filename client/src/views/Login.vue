<template>
  <h1 class="text-error" v-if="redirectMsg">{{ redirectMsg }}</h1>

  <form class="mw-auth" @submit="onSubmit">
    <div class="card flex-column d-flex align-items-center justify-content-center p-2">
      <div class="row text-center">
        <div class="col">
          <h1 class="caption">Login</h1>
        </div>

        <div v-if="errors" class="col text-error">
          <p v-for="error in errors" :key="error">{{ error.constraints[Object.keys(error.constraints)[0]] }}</p>
        </div>

        <div class="col">
          <div class="row">
            <label class="form-label">Email address</label>
            <input class="form-control" v-model="email" name="email" type="email" required />
          </div>
          <div class="row mb-2">
            <label class="form-label">Password</label>
            <div class="col">
              <div class="position-relative">
                <input class="form-control" v-model="password" name="password" :type="type" required />
                <i class="form-password" v-if="passwordVisible" @click="showPassword" :class="passwordIcon"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <button type="submit" class="btn btn-default btn-right-icon">Login<i class="fas fa-user-plus"></i></button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      type: 'password',
      passwordIcon: 'fas fa-eye',
      passwordVisible: false,
      errors: null,
    }
  },

  props: {
    redirectMsg: {},
  },

  methods: {
    onSubmit(e) {
      //console.log(e)
      e.preventDefault()
      //console.log(this.username, this.email, this.password)
      console.log('Login form submitted')

      this.$store
        .dispatch('user/login', { email: this.email, password: this.password })
        .then((data) => {
          console.log(data)
          if (data.error) return (this.errors = data)
          this.$router.push({ name: 'home', params: { redirectMsg: 'Successfully logged in!' } })
          console.log('Redirecting to home...')
          //console.log(data)
        })
        .catch((err) => console.log(err))
    },
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
  },
  watch: {
    password(newValue) {
      if (newValue.length != 0) {
        this.passwordVisible = true
      } else {
        this.passwordVisible = false
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
