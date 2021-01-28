import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';


export default function Index() {
  const { email } = useParams();

  useEffect(() => {
    const formSend = async () => {
      if (!email) return;

   let res =   await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?email=${email}&existingUser=true`, {
        mode: 'no-cors',
      });
       console.log("res ", res);

    };

    formSend();
  }, []);

  return (
    
     <h4>User details</h4>
   
  );
}
