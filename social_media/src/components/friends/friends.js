import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux'
import { insert } from '../../store/friendslice'
import { loading_status } from '../../store/tokenslice'
import { useNavigate } from "react-router-dom";
import "./friends.css"

function Friend() {
  const list = useSelector((state) => state.friends.list)
  const token = useSelector((state) => state.token.token)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  function fetchData(page) {
    dispatch(loading_status(true))
    fetch('http://127.0.0.1:8000/api/account/account_list?ordering=-pk', {
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



  function friendFunctions(pk, type) {
    var url = "http://127.0.0.1:8000/api/account/"
    if (type == 1) { //send friend request
      url = url + `friend_request/${pk}`
    }
    else if (type == 2) { //accept friend request
      url = url + `accept_friend_request/${pk}`
    }
    else if (type == 3) { //unfriend friend
      url = url + `unfriend/${pk}`
    }
    else {

    }
    console.log(url)



    dispatch(loading_status(true))
    fetch(url, {
        headers: {
          "Authorization": token
        },
      })
        .then((response) => response.json())
        .then((result) => {
          // dispatch(insert(result))
          fetchData(1)
        })
        .catch((error) => {
          console.error('Error:', error);
        }).finally((error) => {
          dispatch(loading_status(false))
        })
  }

  function getUrl(url) {
    const domain = "http://127.0.0.1:8000"
    return `${domain}${url}`
  }
  useEffect(() => {
    fetchData(1)
  }, []);
    return (
      <div className='container'>
        {list.map(item =>
          <>
            <Card className="friend-card" key={item.id}>

              <div className='text-info'>
                <p>Username: <b>{item.username}</b></p>
                <p>Email: { item.email }</p>
              </div>

              <div className='card-button'>
                {item.is_friend ? 
                  <button type="button" class="btn btn-primary" onClick={() => friendFunctions(item.pk, 3)}>Unfriend</button> :
                  <>
                    {item.is_requested ? 
                      <button type="button" class="btn btn-primary" onClick={() => friendFunctions(item.pk, 2)}>Accept Request</button> :
                      <>
                        {item.is_request_send ? <button type="button" class="btn btn-primary">Pending</button> :
                        <button type="button" class="btn btn-primary" onClick={() => friendFunctions(item.pk, 1)}>Add</button>}
                      </>
                   }
                  </>}
              </div>
            </Card>
            <br />
          </>
        )}
        
      </div>
  );
}
export default Friend