import { createSlice } from '@reduxjs/toolkit'

export const feedSlice = createSlice({
  name: 'feedlist',
  initialState: {
    list: [],
    page: 1
  },
  reducers: {
    insert: (state, action) => {
      // action.payload.forEach((item) => {
      //   state.list.push(item)
      // })
      state.list = action.payload["results"]
      // state.page = action.payload["page"]
    },
    updatePage: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { insert, decrement, incrementByAmount } = feedSlice.actions

export default feedSlice.reducer