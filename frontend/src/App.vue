<template>
  <Navbar v-if="!loading" />

  <section class="">
    <div class="container">
      <div v-if="loading" class="">loading...</div>

      <router-view v-if="!loading" />
    </div>
  </section>
</template>

<script>
import Navbar from '@/components/Navbar'
import { reAuthentication } from '@/main'

export default {
  components: {
    Navbar,
    /* Login,
    Register, */
  },
  data() {
    return {
      loading: true,
    }
  },
  created() {
    console.log('App mounted')
    // Wait for reauthentication
    reAuthentication.then(() => (this.loading = false))
  },
  methods: {},
}
</script>

<style lang="scss"></style>
