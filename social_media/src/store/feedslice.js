import { createSlice } from '@reduxjs/toolkit'

export const feedSlice = createSlice({
  name: 'feedlist',
  initialState: {
    list: [],
    page: 1,
    profile: null
  },
  reducers: {
    insert: (state, action) => {
      state.list = action.payload["results"]
    },
    updatePage: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },

    insertProfile(state, action) {
      state.profile = action.payload
    }
  },
})

export const { insert, decrement, incrementByAmount, insertProfile } = feedSlice.actions

export default feedSlice.reducer