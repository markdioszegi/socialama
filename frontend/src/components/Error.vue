<template>
  <transition name="slidedown">
    <div class="col text-error">
      <p v-for="error in errors" :key="error">{{ error.constraints[Object.keys(error.constraints)[0]] }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    errors: Object,
  },
}
</script>

<style></style>
