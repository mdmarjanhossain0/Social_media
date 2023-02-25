import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import Feed from "../components/feed/feed";
import Footer from "../components/footer";
import Header from "../components/header";
import "../components/style.css"
import { insert } from '../store/feedslice'

function HomeView() {
    
    return <>
        <Header />
        <Feed />
        <Footer />
        </>
}

export default HomeView;
