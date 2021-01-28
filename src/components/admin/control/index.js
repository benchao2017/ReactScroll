import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Index() {
  const { email } = useParams();

  const [user, setUser] = useState({});

  useEffect(() => {
    const formSend = async () => {
      if (!email) return;

      let res = await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?email=${email}&existingUser=true`);
      res.json().then((data) => {
        let userData = JSON.parse(data.body);
        setUser(userData);
        console.log(userData);
      })

    };

    formSend();
  }, []);

  return (
    <div>
      <h4>{user.email}</h4>
      <h4>{user.phone}</h4>
    </div>
  );
}
