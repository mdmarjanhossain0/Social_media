import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Post from "../components/feed/post";
import Footer from "../components/footer";
import Header from "../components/header";
import "../components/style.css"
import { insert } from '../store/feedslice'

function HomeView() {
    
    return <>
        <Header />
        <Post />
        <Footer />
        </>
}

export default HomeView;
