import React, {useState, useEffect} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import "./feed.css"
import { useSelector, useDispatch } from 'react-redux'
import { insert } from '../../store/feedslice'
import { loading_status } from '../../store/tokenslice'
import { useNavigate } from "react-router-dom";

function Feed() {
  const list = useSelector((state) => state.feeds.list)
  const token = useSelector((state) => state.token.token)

  const [page, setPage] = useState(1)
  const [is_next, set_is_next] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()
  function fetchData(page_number, command) {
    dispatch(loading_status(true))
    fetch('http://127.0.0.1:8000/api/blog/list?ordering=-pk&page=' + page_number, {
        headers: {
          "Authorization": token
        },
      })
        .then((response) => response.json())
        .then((result) => {
          dispatch(insert(result))
          set_is_next(false)
          if (result["next"] != null) {
            set_is_next(true)
          }


          if (command == "none") {
              setPage(page)
            }
            else if (command == "next") {
              setPage(page + 1)
            }
            else {
              setPage(page - 1)
            }
        })
        .catch((error) => {
          console.error('Error:', error);
        }).finally((error) => {
          dispatch(loading_status(false))
        })
  }

  function nextClick() {
    console.log(is_next)
    console.log(page)
    if (is_next) {
      fetchData(page + 1, "next")
    }
  }
  function previous() {

    if (page > 1) {
      fetchData(page - 1, "")
    }
  }
  function getUrl(url) {
    const domain = "http://127.0.0.1:8000"
    return `${domain}${url}`
  }
  useEffect(() => {
    fetchData(page, "none")
  }, []);
    return (
      <div className='container'>
        <Card>
        <Card.Body>
          <Card.Title>Post here What's on your mind</Card.Title>
          <Card.Text>
            You can post in this plartform. Your post just can see your friends.
          </Card.Text>
          <Button variant="primary" onClick={() => {navigate("/create")}}>Create Post</Button>
        </Card.Body>
        </Card>

        <br />
        
        {list.map(item =>
          <>
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
            <br />
          </>
        )}

        <nav aria-label="...">
            <ul className="pagination">
              <li className="page-item disabled" onClick={() => previous()}>
                <a className="page-link">Previous</a>
              </li>
              <li className="page-item" onClick={() => nextClick()}>
                <a className="page-link">Next</a>
              </li>
            </ul>
        </nav>
      </div>
  );
}







export default Feed