import {
    createSlice
} from '@reduxjs/toolkit'

export const friendSlice = createSlice({
    name: 'friendlist',
    initialState: {
        list: [],
        page: 1
    },
    reducers: {
        insert: (state, action) => {
            state.list = action.payload["results"]
        },
        updatePage: (state) => {
            state.value -= 1
        }
    },
})

export const {
    insert
} = friendSlice.actions

export default friendSlice.reducer