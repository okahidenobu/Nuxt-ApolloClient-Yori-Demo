import getUserInfo from '~/apollo/queries/getUserInfo'
import updateUserInfo from '~/apollo/mutations/updateUserInfo'
import createUserInfo from '~/apollo/mutations/createUserInfo'

export const state = () => ({
  userInfo: [],
})

export const mutations = {
  setUserInfo(state, data) {
    state.userInfo = data
  },
  updateUserInfo(state, { userId }) {
    for (const updateTarget of state.userInfo) {
      updateTarget.userId = userId
    }
  },

  createUserInfo(state, data) {
    state.userInfo.push(data)
  },
}

export const actions = {
  async getUserInfo({ commit }) {
    const response = await this.app.apolloProvider.defaultClient.query({
      query: getUserInfo,
    })

    commit('setUserInfo', response.data.getUserInfo)
  },
  async updateUserInfo({ commit }, { userId }) {
    await this.app.apolloProvider.defaultClient.mutate({
      mutation: updateUserInfo,
      variables: {
        userId,
      },
    })

    commit('setUserInfo', { userId })
  },
  addNewData({ commit }, data) {
    commit('addNewState', data)
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
}
