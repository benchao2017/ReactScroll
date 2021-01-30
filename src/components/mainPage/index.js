import React, { useEffect } from 'react';
import '../../styles.css';
import 'intersection-observer';
import { useParams } from 'react-router-dom';
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { updateUserActivity, createUserActivity } from '../../graphql/mutations'
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
  
    const updateMousePosition = async (ev) => {
      if (!email) return;

      var payload = { id: email, cursorPosition: `${window.scrollX},${window.scrollY},${window.innerWidth},${window.innerHeight}`, phone: '+1' };
      try {
        let { data } = await API.graphql(graphqlOperation(updateUserActivity, { input: payload }));
      } catch(ex) {
        let { _data } = await API.graphql(graphqlOperation(createUserActivity, { input: payload }));

      }

    };
  
    useEffect(() => {
      window.addEventListener("scroll", updateMousePosition);
  
      return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);

  useEffect(() => {


    const formSend = async () => {
      if (!email) return;

      // await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?email=${email}`, {
      //   mode: 'no-cors',
      // });
    };
    formSend();
  }, []);

  return (
    <>
    <Content></Content>
    </>
  );
}
