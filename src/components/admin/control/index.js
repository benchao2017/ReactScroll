import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'


export default function Index() {
  const { email } = useParams();

  const [loading, setLoading] = useState("Loading user detail ......");
  const setStillLoading = () => {
    setLoading("Loading user detail ......");
  }
  const setLoadingComplete = () => {
    setLoading(null);
  }

  const [user, setUser] = useState({});

  useEffect(() => {
    const formSend = async () => {
      if (!email) return;
      setStillLoading();
      let res = await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?email=${email}&existingUser=true`);
      setLoadingComplete();
      res.json().then((data) => {
        let userData;
        if (data.body) {
          userData = JSON.parse(data.body);
          setUser(userData);
        } else {
          setUser(null);
        }
        console.log(userData);
      })

    };

    formSend();
  }, []);

  return (
    <div>
      <h5
      style={{ margin: '50px' }}
      >{loading}</h5>
      {!user &&  <Card
    bg={'danger'}   
    text={'white'}
    style={{ width: '90%', margin: '50px' }}
    className="mb-12"
  >
    <Card.Header>User details</Card.Header>
    <Card.Body>
      <Card.Title> No user found </Card.Title>
      <Card.Text>
        No user found with email: {email}
      </Card.Text>
    </Card.Body>
  </Card>}
      {!loading && user && <Card
         style={{ width: '90%', margin: '50px' }}
      >
        <Card.Header>User details</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>
              {' '}
        Following are the user details {' '}
            </p>
            <footer className="blockquote-footer">
              <br></br>
              Email <cite title="Source Title">{user.email}</cite>
            <br></br>  Phone <cite title="Source Title">{user.phone}</cite>
            </footer>
          </blockquote>
        </Card.Body>
      </Card>
      }
    </div>
  );
}
