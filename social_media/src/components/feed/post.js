import React, { useState, useEffect } from 'react'

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { loading_status } from "../../store/tokenslice"

export default function Post() {

    const navigate = useNavigate();
    const dispatch = useDispatch()




    const token = useSelector((state) => state.token.token)

    const [content, setContent] = useState("");

    const [status, setStatus] = useState("")

    async function create() {
        dispatch(loading_status(true))
        var image = document.getElementById("image").files[0];
        const formData = new FormData();
        if (image) {
            formData.append("image", image)
        }
        formData.append('body', content);

        fetch('http://127.0.0.1:8000/api/blog/create', {
            method: 'POST',
            headers: {
                "Authorization": token
            },
        body: formData
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
        })
            .then((result) => {
            setStatus(result["status"])
        })
        .catch((error) => {
            console.error('Error:', error);
        }).finally((error) => {
            dispatch(loading_status(false))
        })
        console.log(status)
    }
        return (
        <div className='container'>
            <form>
                <h3 style={{ textAlign: "center" }}>Write what's in your mind</h3>
                <div className='mb-3'>
                        <input type="file"
                            id='image'
                        />
                </div>
            <div className="mb-3">
                {/* <label>Email address</label> */}
                <textarea
                    type="email"
                    className="form-control"
                            placeholder="write here something..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        style={{
                            minHeight: "30vh"
                        }}
                />
                    </div>
                    <h3 style={{ textAlign: "center" }}>{status}</h3>
            <div className="d-grid">
                <div className="btn btn-primary" onClick={() => create()}>
                    Submit
                </div>
            </div>
            </form>
            <br />
        </div>
    )


}