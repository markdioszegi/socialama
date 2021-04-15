<template>
  <form class="mw-auth" @submit="onSubmit">
    <div class="card flex-column d-flex align-items-center justify-content-center p-2">
      <div class="row text-center">
        <div class="col">
          <h1 class="caption">Register</h1>
        </div>

        <div v-if="errors" class="col text-error">
          <p v-for="error in errors" :key="error">{{ error.constraints[Object.keys(error.constraints)[0]] }}</p>
        </div>

        <div class="col">
          <div class="row">
            <label class="form-label">Username</label>
            <input class="form-control" v-model="username" name="username" type="text" required />
          </div>
          <div class="col">
            <div class="row">
              <label class="form-label">Email address</label>
              <input class="form-control" v-model="email" name="email" type="email" required />
            </div>
          </div>
          <div class="row">
            <label class="form-label">Password</label>
            <div class="col">
              <div class="position-relative">
                <input class="form-control" v-model="password" name="password" :type="type" required />
                <i class="form-password" v-if="passwordVisible" @click="showPassword" :class="passwordIcon"></i>
              </div>
            </div>
          </div>
          <div class="col mb-2">
            <div class="row">
              <label class="form-label">Password again</label>
              <input class="form-control" :type="type" required />
            </div>
          </div>
        </div>

        <div class="col">
          <button type="submit" class="btn btn-default btn-right-icon">Register<i class="fas fa-user-plus"></i></button>
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

  methods: {
    onSubmit(e) {
      //console.log(e)
      e.preventDefault()
      //console.log(this.username, this.email, this.password)
      console.log('Form submitted')

      fetch(process.env.VUE_APP_API_BASE_URL + '/auth/register', {
        method: 'post',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          password: this.password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          if (!data.success) return (this.errors = data)
          this.$router.push({ name: 'home', params: { redirectMsg: 'Account successfully created!' } })
        })
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
