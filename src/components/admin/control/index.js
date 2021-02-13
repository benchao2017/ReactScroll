import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'

import Button from 'react-bootstrap/Button'

import { getUserActivity } from '../../../graphql/queries'
import useWindowSize from '../../../helper/windowResizeHook'
import Content from '../../mainPage/content';

import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { onUpdateUserActivity } from '../../../graphql/subscriptions'
import { updateUserActivity, createUserActivity } from '../../../graphql/mutations'
import awsExports from '../../../aws-exports';
Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true
  }
});


export default function Index() {
  const { email } = useParams();

  const [loading, setLoading] = useState("Loading user detail ......");

  const [user, setUser] = useState({});

  const windowState = useWindowSize();

  const [userActivityDetails, setUserActivityDetails] = useState(null);
  const [isScrollControlled, setScrollControl] = useState(false);

  const toggleScrollControl = () => {
    setScrollControl(!isScrollControlled);
  }

  const setStillLoading = () => {
    setLoading("Loading user detail ......");
  }
  const setLoadingComplete = () => {
    setLoading(null);
  }



  const updateMousePosition = async (ev) => {

    if (!isScrollControlled) return;

    if (!email) return;

    var payload = { id: "admin.admin", cursorPosition: `${window.scrollX},${window.scrollY},${window.innerWidth},${window.innerHeight},${email}`, phone: '+1' };
    try {
      let { data } = await API.graphql(graphqlOperation(updateUserActivity, { input: payload }));
    } catch (ex) {
      let { _data } = await API.graphql(graphqlOperation(createUserActivity, { input: payload }));

    }

  };

  useEffect(() => {
    window.addEventListener("scroll", updateMousePosition);

    return () => window.removeEventListener("scroll", updateMousePosition);
  }, [isScrollControlled]);

  useEffect(() => {

    const setScrollPosition = (userActivityDetails) => {
      let xy = userActivityDetails?.cursorPosition?.split(',');
      let x = xy[0];
      let y = xy[1];

      let options = { top: y, left: x, behavior: 'smooth' }; // left and top are coordinates
      window.scrollTo(options);
    }

    const formSend = async () => {

      if (!email) return;

      try {
        let { data } = await API.graphql(graphqlOperation(getUserActivity, { id: email }));
        setUserActivityDetails(data.getUserActivity);

        setScrollPosition(data.getUserActivity);
      } catch (ex) {
        console.log(ex);
      }


      const subscription = API.graphql(
        graphqlOperation(onUpdateUserActivity)
      ).subscribe({
        next: (data) => {
          let userActivityDetails = data.value.data.onUpdateUserActivity;
          if (userActivityDetails?.id != email) return;

          setUserActivityDetails(userActivityDetails);
          setScrollPosition(userActivityDetails);
          // Do something with the data
        }
      });

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
      })

    };

    formSend();
  }, []);

  return (
    <div>
      <div className="admin-card-container">
        <h5
          style={{ margin: '50px' }}
        >{loading}</h5>
        {!user && <Card
          bg={'danger'}
          text={'white'}
          style={{ width: '70%', margin: '50px' }}
        >
          <Card.Header>User details</Card.Header>
          <Card.Body>
            <Card.Title> No user found </Card.Title>
            <Card.Text>
              No user found with email: {email}
            </Card.Text>
            <Card
              bg={'secondary'}
              text={'white'}
              style={{ width: '100%', margin: '30px 0' }}
              className="mb-4"
            >
              <Card.Header>Activity details</Card.Header>
              <Card.Body>
                <Card.Title> Window scroll position
              </Card.Title>
                <Card.Text>
                  <Button variant={!isScrollControlled ? 'danger' : 'warning'} onClick={toggleScrollControl}>{!isScrollControlled ? 'Take' : 'Release'} control</Button>
                  <br></br>
                  scroll(X, Y) : {userActivityDetails?.cursorPosition?.split(',')[0]}, {userActivityDetails?.cursorPosition?.split(',')[1]} <br></br>
                  window(W, H) : {userActivityDetails?.cursorPosition?.split(',')[2]}, {userActivityDetails?.cursorPosition?.split(',')[3]}
                </Card.Text>
              </Card.Body>
              {userActivityDetails?.cursorPosition?.split(',')[2] != window.innerWidth
                && userActivityDetails?.cursorPosition?.split(',')[3] != window.innerHeight &&
                <Card.Footer className="danger-footer">
                  Warning: Your window's WIDTH and HEIGHT are ({windowState.innerWidth}, {windowState.innerHeight}) which are not same as WIDTH and HEIGHT of visitor's window.
              </Card.Footer>}
            </Card>
          </Card.Body>
        </Card>}
        {!loading && user && <Card
          style={{ width: '70%', margin: '50px' }}
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
              Email: <cite title="Source Title">{user.email}</cite>
                <br></br>  Phone: <cite title="Source Title">{user.phone}</cite>
              </footer>
            </blockquote>
            <Card
              bg={'secondary'}
              text={'white'}
              style={{ width: '100%', margin: '30px 0' }}
              className="mb-4"
            >
              <Card.Header>Activity details</Card.Header>
              <Card.Body>
                <Card.Title> Window scroll position </Card.Title>
                <Card.Text>
                  <Button variant={!isScrollControlled ? 'danger' : 'warning'} onClick={toggleScrollControl}>{!isScrollControlled ? 'Take' : 'Release'} control</Button>
                  <br></br>
                  scroll(X, Y) : {userActivityDetails?.cursorPosition?.split(',')[0]}, {userActivityDetails?.cursorPosition?.split(',')[1]} <br></br>
                  window(W, H) : {userActivityDetails?.cursorPosition?.split(',')[2]}, {userActivityDetails?.cursorPosition?.split(',')[3]}
                </Card.Text>
              </Card.Body>
              {userActivityDetails?.cursorPosition?.split(',')[2] != window.innerWidth
                && userActivityDetails?.cursorPosition?.split(',')[3] != window.innerHeight &&
                <Card.Footer className="danger-footer">
                  Warning: Your window's WIDTH and HEIGHT are ({windowState.innerWidth}, {windowState.innerHeight}) which are not same as WIDTH and HEIGHT of visitor's window.
              </Card.Footer>}
            </Card>
          </Card.Body>
        </Card>
        }
      </div>
      <Content />
    </div>
  );
}
