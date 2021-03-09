<template>
  <h2 class="text-success" v-if="redirectMsg">{{ redirectMsg }}</h2>
  <!-- <h1>You are at the home page!</h1>
  {{ sharedState.counter }} -->

  <p>{{ states.token ? states.token : 'access token is literally nothing' }}</p>
  <p>{{ states.user ? states.user : 'user is literally nothing' }}</p>
  <p>Am I authenticated: {{ states.isAuthenticated ? true : false }}</p>

  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-header">
          <h4>Card header</h4>
        </div>
        <div class="card-body">
          <h1>h1 text</h1>
          <h2>h2 text</h2>
          <h3>h3 text</h3>
          <h4>h4 text</h4>
          <h5>h5 text</h5>
          <h6>h6 text</h6>
          <h1 class="display-1">Display 1</h1>
          <h1 class="display-2">Display 2</h1>
          <h1 class="display-3">Display 3</h1>
          <h1 class="display-4">Display 4</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem corrupti, rerum soluta optio eveniet ad magni
            quae totam qui. Nemo eligendi est magnam ut veritatis amet dolores minima dolorem beatae.
          </p>
          <button class="btn btn-primary">Primary button</button>
          <button class="btn btn-secondary">secondary button</button>
          <button class="btn btn-outline-primary">Outline primary button</button>
          <button class="btn btn-danger">Danger button</button>
          <button class="btn btn-warning">warning button</button>
          <button class="btn btn-info">info button</button>
          <button class="btn btn-outline-info">info button</button>
          <button class="btn btn-success">info button</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sharedState: this.$store,
    }
  },
  props: { redirectMsg: {} },
  computed: {
    states() {
      return {
        token: this.$store.getters['user/accessToken'],
        user: this.$store.getters['user/user'],
        isAuthenticated: this.$store.getters['user/isAuthenticated'],
      }
    },
  },
}
</script>

<style></style>
