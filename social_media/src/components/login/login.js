import React, { Component, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { loading_status } from "../../store/tokenslice"

export default function LogIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    dispatch(loading_status(true))
    const formData = new FormData();
    formData.append('username', email);
    formData.append("password", password)

    fetch('http://127.0.0.1:8000/api/account/login', {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["response"] == "Successfully authenticated.") {
          localStorage.setItem("social_media_token", "Token " + result["token"])
          navigate("/")
        }
        else {
          localStorage.removeItem("social_media_token")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      }).finally((error) => {
        dispatch(loading_status(false))
      })
  }
  return (
      <>
      <form>

        <h3>Sign In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="d-grid">
          <div className="btn btn-primary" onClick={() => login()}>
            Sign In
          </div>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </form>
      </>
    )
}