import { configureStore } from '@reduxjs/toolkit'
import feedSlice from './store/feedslice'
import tokenSlice from './store/tokenslice'

import friendSlice from './store/friendslice'

export default configureStore({
    reducer: {
        feeds: feedSlice,
        token: tokenSlice,
        friends: friendSlice
    },
})