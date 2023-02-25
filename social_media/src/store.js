import { configureStore } from '@reduxjs/toolkit'
import feedSlice from './store/feedslice'
import tokenSlice from './store/tokenslice'

export default configureStore({
    reducer: {
        feeds: feedSlice,
        token: tokenSlice,
    },
})