<template>
  <v-snackbar :value="snackbar">
    {{ message }}
    <!--    <v-btn color="pink" text @click="closeSnackbar">Close</v-btn>-->
    <global-btn text="close" @closeSnackbar="closeSnackbar" />
  </v-snackbar>
</template>

<script>
import GlobalBtn from './GlobalBtn'

export default {
  name: 'GlobalSnackbar',
  components: { GlobalBtn },
  props: {
    snackbar: { type: Boolean, default: false },
    message: { type: String, default: 'データが変更がありました' },
  },
  // data() {
  //   return {
  //     snackbar: false,
  //     message: 'データが変更がありました',
  //   }
  // },
  methods: {
    closeSnackbar() {
      this.snackbar = false
    },
  },
}
</script>
