<template>
  <v-snackbar :value="getSnackbar.isEnable">
    {{ getSnackbar.message }}
    <global-btn text="close" />
  </v-snackbar>
</template>

<script>
import gql from 'graphql-tag'
import GlobalBtn from './GlobalBtn'

export default {
  name: 'GlobalSnackbar',
  components: { GlobalBtn },
  data() {
    return {
      getSnackbar: {},
    }
  },
  apollo: {
    getSnackbar: {
      query: gql`
        {
          getSnackbar @client {
            isEnable
            message
          }
        }
      `,
    },
  },
}
</script>
