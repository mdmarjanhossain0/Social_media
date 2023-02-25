import { createSlice } from '@reduxjs/toolkit'

export const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        token: null,
        is_loading: false
    },
    reducers: {
        insertToken(state, action) {
            console.log("insert token")
            state.token = action.payload
        },
        removeToken(state) {
            localStorage.removeItem("social_media_token")
            state.token = null
        },







        loading_status(state, action) {

            state.is_loading = action.payload
        }
},
})

export const { insertToken, removeToken, loading_status } = tokenSlice.actions

export default tokenSlice.reducer