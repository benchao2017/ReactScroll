# Instructions

First you need to download and configure Amplify CLI (if you haven't already). Go to the root project folder and type
these commands, following the instructions:

```bash
npm install -g @aws-amplify/cli
amplify configure
```

## Backend

Then you set up the project by creating a new folder, changing to this directory and performing this command:

```bash
amplify init --app https://github.com/andrestone/glidaa-amplify.git
```

This command will output the API endpoint, but it'll also start your react development server. Type CTRL-C to stop the
development server in order to copy the API endpoint, you'll need it later.

And this finishes the backend. Whenever changes are made to the backend code (the lambda function, for example), the
changes are deployed by running `amplify push`.

## Frontend

In order to set up the CICD for the frontend code, you type:

```
amplify add hosting
```

You have to select "Hosting with Amplify Console (Managed hosting with custom domains, Continuous deployment)". Then
"Continuous deployment (Git-based deployments)". When your browser opens, you have to perform these steps:

- Click on the "Frontend" tab. If you can't see this screen and can see your app name instead, click the app name to get
  to the screen where you can select the "Frontend" tab.

- Click on GitHub and click on "Connect Branch".

- Follow the instructions to connect your GitHub account.

- Select this repository and the branch that will trigger the deployments. Click next.

- UNCHECK "Deploy updates do backend resources with your frontend on every code commit." Click next.

- Click "Save and deploy".

Go back to the terminal and press enter. Amplify will output the url of your website, that can be later customized in
the Amplify console.

This finishes the frontend. Whenever changes are commited to the selected branch, a new deployment will be triggered and
the website will be updated.

## Customizing and Testing

In order to test the requested functionality, first you need to log into your AWS SES console and verify a sending email
address (https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html). It's important
that you're logged in to the same AWS region that you have selected when configuring Amplify with `amplify configure`.

Then, you need to modify the Lambda function to use this verified email address to send emails. You also would want to
replace the destination email addresses to actual email addresses where you can receive emails.

`amplify/backend/function/apilambda/src/app.js`

```js
var params = {
  Destination: {
    BccAddresses: [],
    CcAddresses: ['manage2@glidaa.com'], // A secondary email address to receive the notification
    ToAddresses: ['manager@glidaa.com'], // A primary email address to receive the notification
  },
  Message: {
    Body: {
      Html: {
        Charset: 'UTF-8',
        // This is the HTML content for the email
        Data: `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now})`,
      },
      Text: {
        Charset: 'UTF-8',
        // This is the text content for the email
        Data: `The user ${putItemParams.Item.email} just clicked the email link and is visiting the website (${now})`,
      },
    },
    Subject: {
      Charset: 'UTF-8',
      // This is the subject
      Data: 'New visit from at website',
    },
  },
  // This is the email you have authorized in AWS SES
  Source: 'authorized@email.com',
};
```

After editing this file, you go to your project root folder and do `amplify push` to update the lambda function.

You also need to replace the placeholder endpoint in this file:

`src/components/mainPage/index.js`

```js
const formSend = async () => {
  if (!email) return;
  await fetch(`https://put.the-endpoint.here/visit?email=${email}`, {
    mode: 'no-cors',
  });
};
```

After editing this file, you have to push the changes to github in order to update the hosted frontend.

Then you can test it by constructing your links appending the email of the client to your website url:
[](https://yourhostedurl.com/client@company.com).

If you followed these instructions, you should see a DynamoDB table with the record of this visit in your DynamoDB
console. You should also receive an email with the notification.

## Considerations about using Amplify with SES

Amplify doesn't support SES on its core. In order to have SES working with a Lambda function, there's a manual step that
must be performed everytime you add or update a function. This step ensures the Lambda function will be able to call SES
service. This is a warning for future developers, because if you strictly follow these instructions, there's no need to
perform this manual step in order to have the API working properly.
