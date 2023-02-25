import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./feed.css"
import { useSelector, useDispatch } from 'react-redux'
import { insert } from '../../store/feedslice'
import { loading_status } from '../../store/tokenslice'

function Feed() {
  const list = useSelector((state) => state.feeds.list)
  const token = useSelector((state) => state.token.token)
  const dispatch = useDispatch()
  function fetchData(page) {

    dispatch(loading_status(true))
    fetch('http://127.0.0.1:8000/api/blog/list?ordering=-pk', {
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
  useEffect(() => {
    fetchData(1)
  }, []);
    return (
      <div className='container'>
        <Card>
        <Card.Body>
          <Card.Title>Post here What's on your mind</Card.Title>
          <Card.Text>
            You can post in this plartform. Your post just can see your friends.
          </Card.Text>
          <Button variant="primary">Create Post</Button>
        </Card.Body>
        </Card>

        <br />
        
        {list.map(item =>
          <>
            <Card className="post-card" key={item.id}>
              {item.image ? 
                <Card.Img className='card-image' variant="top" src={item.image} />
                :
                <></>
            }
            <Card.Body>
              <Card.Text>
                {item.body}
              </Card.Text>
            </Card.Body>
            </Card>
            <br />
          </>
        )}
        
      </div>
  );
}







export default Feed