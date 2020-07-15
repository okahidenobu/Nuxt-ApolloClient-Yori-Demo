<template>
  <div>
    {{ userInfo }}
    <v-btn @click="updateUserInfo(82)">update</v-btn>
    <v-btn @click="createUserInfo(82)">create</v-btn>
    <v-btn @click="deleteUserInfo(Number(45))">delete</v-btn>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData({ store }) {
    store.dispatch('vuexTest/getUserInfo')
    return {}
  },
  computed: {
    ...mapState('vuexTest', ['userInfo']),
  },
  methods: {
    updateUserInfo(userId) {
      this.$store.dispatch('vuexTest/updateUserInfo', { userId })
    },
    createUserInfo(userId) {
      this.$store.dispatch('vuexTest/createUserInfo', { userId })
    },
    deleteUserInfo(id) {
      this.$store.dispatch('vuexTest/deleteUserInfo', { id })
    },
  },
}
</script>
