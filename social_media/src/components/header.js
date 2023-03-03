import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
// import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { removeToken, loading_status } from "../store/tokenslice"
import { insert } from '../store/friendslice'


import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import LoadingScreen from './loadingscreen';

function Header() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.token.token)
  const is_loading = useSelector((state) => state.token.is_loading)


  const [username, setSearch] = useState("")
  const dispatch = useDispatch()



  function navigateLogIn() {
    navigate("/login")
  }
  function isAuthenticated() {
    console.log(token)
    return token != null
  }
  
  function navigateProfile() {
      navigate("/profile");
  }
  function logout() {
    localStorage.removeItem("social_media_token")
    dispatch(removeToken())
    navigate("/login")
  }

  function navigateSinUp() {
    navigate("/signup")
  }
  
  function navigateHome() {
    navigate("/")
  }

  function navigateFriends() {
    navigate("/friend")
  }

  function search() {
    navigate("/friend?query=" + username)
    dispatch(loading_status(true))
    fetch('http://127.0.0.1:8000/api/account/account_list?ordering=-pk&search=' + username, {
                headers: {
                    "Authorization": token
                },
            })
            .then((response) => response.json())
            .then((result) => {
                dispatch(insert(result))
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally((error) => {
                dispatch(loading_status(false))
            })
  }
  return (
    <>
      <Navbar bg="primary" expand="lg" variant='dark'>
        <Container fluid>
          <Navbar.Brand href="#">Social Media</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link onClick={navigateHome}>Home</Nav.Link>
              { !token ?
                <>
                  <Nav.Link onClick={navigateLogIn}>
                    SinIn
                  </Nav.Link>
                  <Nav.Link onClick={navigateSinUp}>
                    SinUp
                  </Nav.Link>
                  </>
                :
    
                  <>
                  <Nav.Link onClick={navigateProfile}>Profile</Nav.Link>
                  <Nav.Link onClick={navigateFriends}>Friend</Nav.Link>
                  <Nav.Link onClick={logout}>
                    LogOut
                  </Nav.Link>
                </>
              }
              </Nav>
            <Form className="d-flex">
              <input
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={username}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="outline-success" onClick={() => search()}>Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {is_loading ? 
        <div className='loadingscrendiv'>
        <LoadingScreen
      />
      </div> : <> </>
      }
    </>
  );
}

export default Header;