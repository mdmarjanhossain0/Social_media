import React from 'react'
import Footer from "../components/footer";
import Header from "../components/header";
import SignUp from '../components/signup/signup';
import "../components/style.css"

function HomeView() {
    return <>
        <Header />
        <div className='container'>
            <br />
            <SignUp />
            <br />
        </div>
        <Footer />
        </>
}

export default HomeView;
