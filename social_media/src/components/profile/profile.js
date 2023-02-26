import React, { useEffect } from "react"

import { useSelector, useDispatch } from 'react-redux'
import { loading_status } from '../../store/tokenslice'
import { insertProfile } from "../../store/feedslice"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function Profile() {
  
  const token = useSelector((state) => state.token.token)
  const profile = useSelector((state) => state.feeds.profile)
  const dispatch = useDispatch()



  function getUrl(url) {
    const domain = "http://127.0.0.1:8000"
    return `${domain}${url}`
  }
  
  function fetchData() {

    dispatch(loading_status(true))
    fetch('http://127.0.0.1:8000/api/account/properties', {
        headers: {
          "Authorization": token
        },
      })
        .then((response) => response.json())
      .then((result) => {
          dispatch(insertProfile(result))
        })
        .catch((error) => {
          console.error('Error:', error);
        }).finally((error) => {
          dispatch(loading_status(false))
        })
  }
  useEffect(() => {
    fetchData()
  }, []);
  if (profile) {
    return (
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                
                <div className="card-body p-4 text-black">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                      <p className="font-italic mb-1">Username: { profile["username"] }</p>
                      <p className="font-italic mb-1">Email: { profile["email"] }</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0">Recent Posts</p>
                    <p className="mb-0"><a href="#!" className="text-muted"></a></p>
                  </div>


                  {profile["post_list"].map((item) => 
                  <div className="row g-2">
                    <div className="col mb-2">
                      <Card className="post-card" key={item.id}>
                      <Card.Body>
                        <Card.Text>
                          {item.body}
                        </Card.Text>
                        </Card.Body>
                        {item.image ? 
                          <Card.Img className='card-image' variant="top" src={ getUrl(item.image) } />
                          :
                          <></>
                      }
                      </Card>
                    </div>
                  </div>
                  )}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  else {
    return (
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                
                <div className="card-body p-4 text-black">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                      <p className="font-italic mb-1">Username: </p>
                      <p className="font-italic mb-1">Email: </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}


export default Profile