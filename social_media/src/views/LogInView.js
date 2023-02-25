import React from 'react'
import Footer from "../components/footer";
import Header from "../components/header";
import LogIn from '../components/login/login';
import "../components/style.css"

function HomeView() {
    return <>
        <Header />
        <div className='container'>
            <br />



            <LogIn />
            <br />
        </div>
        <Footer />
        </>
}

export default HomeView;
