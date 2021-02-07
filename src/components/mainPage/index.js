import React, { useEffect, useState } from 'react';
import '../../styles.css';
import 'intersection-observer';
import { useParams } from 'react-router-dom';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { updateUserActivity, createUserActivity } from '../../graphql/mutations'
import { onUpdateUserActivity } from '../../graphql/subscriptions'
import Alert from 'react-bootstrap/Alert'
import awsExports from '../../aws-exports';
// COMPONENTS...
import Content from './content';

Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true
  }
});


export default function Index() {
  const { email } = useParams();

  const setTimeOutVal = 10000;

  const [isAdminControlling, setScrollControl] = useState(false);

  const updateMousePosition = async (ev) => {
    console.log("Admin control", isAdminControlling);
    if (!isAdminControlling) {
      if (!email) return;

      var payload = { id: email, cursorPosition: `${window.scrollX},${window.scrollY},${window.innerWidth},${window.innerHeight}`, phone: '+1' };
      try {
        let { data } = await API.graphql(graphqlOperation(updateUserActivity, { input: payload }));
        console.log(data)
      } catch (ex) {
        let { _data } = await API.graphql(graphqlOperation(createUserActivity, { input: payload }));
        console.log(_data)
      }
    }

  };

  let interval = null;

  var runInterval = (time) => {

    if (interval) {
      clearTimeout(interval)
      // interval = null
    }

    interval = setTimeout(() => {
      setScrollControl(false);
      runInterval(time) // 500 is an example of a new time
    }, time)

  }

  useEffect(() => {
    window.addEventListener("scroll", updateMousePosition);

    return () => window.removeEventListener("scroll", updateMousePosition);
  }, [isAdminControlling]);

  useEffect(() => {

    const subscription = API.graphql(
      graphqlOperation(onUpdateUserActivity)
    ).subscribe({
      next: (data) => {
        let userActivityDetails = data.value.data.onUpdateUserActivity;
        // console.log("Admin activity: ", userActivityDetails);
        let xy = userActivityDetails?.cursorPosition?.split(',');
        let x = xy[0];
        let y = xy[1];
        let target = xy[4];
        if (userActivityDetails?.id == 'admin.admin' && target == email) {
          setScrollControl(true);
          let options = { top: y, left: x, behavior: 'smooth' }; // left and top are coordinates
          window.scrollTo(options);
          runInterval(setTimeOutVal);

        };
      }
    });

    const formSend = async () => {
      if (!email) return;

      await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?email=${email}`, {
        mode: 'no-cors',
      });
    };
    formSend();
  }, []);

  return (
    <>
      <Content></Content>
      <Alert variant="warning" show={isAdminControlling} transition={true}>
        Page controlled by Admin
  </Alert>
    </>
  );
}
