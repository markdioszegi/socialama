<template>
  <transition name="dropdown">
    <div v-if="!dropdownHidden" class="dropdown shadow-xl">
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {}
  },

  props: {
    dropdownHidden: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style></style>
