<template>
  <div class="modal" @click="hideModal">
    <!--  -->
    <transition name="slidedown">
      <div v-if="modalVisible" @click.stop class="modal-content d-flex align-items-center position-relative">
        <div class="card w-100">
          <div class="card-header">
            <div class="d-flex justify-content-between">
              <h1>{{ headerText }}</h1>
              <div class="modal-close">
                <button @click="hideModal" class="btn btn-icon btn-danger">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <p>{{ bodyText }}</p>
            <button @click="confirmModal" class="btn btn-outline-success">Yes</button>
            <!-- <button @click="declineModal" class="btn btn-danger">No</button> -->
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalVisible: false,
    }
  },
  mounted() {
    this.modalVisible = true
  },
  props: {
    headerText: {
      type: String,
      default: 'headerText',
    },
    bodyText: {
      type: String,
      default: 'bodyText',
    },
  },
  methods: {
    confirmModal() {
      //Settings.methods.toggleSubmitModal()
      this.$emit('modalConfirmed')
      this.hideModal()
    },
    declineModal() {
      this.hideModal()
    },
    hideModal() {
      this.$emit('showModal')
    },
  },
}
</script>

<style></style>
