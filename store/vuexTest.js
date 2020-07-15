import getUserInfo from '~/apollo/queries/getUserInfo'
import updateUserInfo from '~/apollo/mutations/updateUserInfo'
import createUserInfo from '~/apollo/mutations/createUserInfo'
import deleteUserInfo from '~/apollo/mutations/deleteUserInfo'

export const state = () => ({
  userInfo: [],
})

export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data
  },

  createUserInfo(state, data) {
    state.userInfo.push(data)
  },

  // うまく動いてない。yorisoiではstoreでupdateは使ってない模様。不要？
  updateUserInfo(state, { userId }) {
    for (const updateTarget of state.userInfo) {
      updateTarget.userId = userId
    }
  },

  // うまく動いてない。yorisoiではstoreでdeleteは使ってない模様
  deleteUserInfo(state, { id }) {
    state.userInfo.filter((r) => r.id !== id)
  },
}

export const actions = {
  async getUserInfo({ commit }) {
    const response = await this.app.apolloProvider.defaultClient.query({
      query: getUserInfo,
    })

    commit('setUserInfo', response.data.getUserInfo)
  },

  async createUserInfo({ commit }, { userId }) {
    const { data } = await this.app.apolloProvider.defaultClient.mutate({
      mutation: createUserInfo,
      variables: {
        userId,
      },
    })
    commit('createUserInfo', data.createUserInfo)
  },

  // 不要？
  async updateUserInfo({ commit }, { userId }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: updateUserInfo,
      variables: {
        userId,
      },
    })

    commit('setUserInfo', { userId })
  },

  // 不要？
  async deleteUserInfo({ commit }, { id }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: deleteUserInfo,
      variables: {
        id,
      },
    })
    commit('deleteUserInfo', { id })
  },
}
