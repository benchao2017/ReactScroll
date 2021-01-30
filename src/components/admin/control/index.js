import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { onUpdateUserActivity } from '../../../graphql/subscriptions'
import { getUserActivity } from '../../../graphql/queries'
import useWindowSize from '../../../helper/windowResizeHook'

import awsExports from '../../../aws-exports';
import Content from '../../mainPage/content';
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

  const setStillLoading = () => {
    setLoading("Loading user detail ......");
  }
  const setLoadingComplete = () => {
    setLoading(null);
  }


  useEffect(() => {

    const setScrollPosition = (userActivityDetails) => {
      let xy = userActivityDetails?.cursorPosition?.split(',');
      let x = xy[0];
      let y = xy[1];
      window.scrollTo(x, y);
      console.log(x, y);
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

      // Subscribe to creation of Todo
      const subscription = API.graphql(
        graphqlOperation(onUpdateUserActivity)
      ).subscribe({
        next: (data) => {
          let userActivityDetails = data.value.data.onUpdateUserActivity;
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
                <Card.Title> Window scroll position </Card.Title>
                <Card.Text>
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
