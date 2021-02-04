import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import AppRitchTextEditor from '../../helper/appRitchTextEditor';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify'
import { onUpdateUserActivity } from '../../graphql/subscriptions'
import { updateEmailTemplate, createEmailTemplate } from '../../graphql/mutations'
import { listEmailTemplates } from '../../graphql/queries'
import awsExports from '../../aws-exports';
Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true
  }
});


export default function Email({ }) {


  const [emailTemalates, setEmailTempaltes] = useState([]);
  const [selectedTempalte, setSelectedTempalte] = useState({});
  const [htmlBody, setHtmlBody] = useState('');
  const [textBody, setTextBody] = useState();
  const [subject, setSubject] = useState();
  const [isLoadHtmlBody, setHtmlBodyLoad] = useState(false);


  useEffect(() => {

    const req = async () => {
      try {
        let res = await API.graphql(graphqlOperation(listEmailTemplates));
        console.log("all templates", res);
        setEmailTempaltes(res.data.listEmailTemplates?.items);
      } catch {

      }
    };

    req();
  }, []);

  const handleTemplateChange = (item) => {


    setSubject(item.subject);
    setHtmlBody(item.htmlBody);
    setTextBody(item.textBody);

    setSelectedTempalte(item);

    setHtmlBodyLoad(true);

  }

  const handleNewClick = () => {
    setHtmlBodyLoad(true);
    setSelectedTempalte({});
    setSubject('');
    setHtmlBody('');
    setTextBody('');
  }

  const onHtmlBodyChange = (value) => {
    setHtmlBodyLoad(false);
    setHtmlBody(value);  
  }

  const submitHandler = async (event) => {
    event.preventDefault();

    const { subject, textBody, files } = event.target.elements;
   console.log(files.files, files.value);
   if(files.value)
   {
   const file = files.files[0];
      Storage.put(files.value, file, {
          contentType: file.type
      })
      .then (result => console.log(result))
      .catch(err => console.log(err));
    }

    if (!selectedTempalte?.id) {
      const payload = {
        name: subject.value,
        subject: subject.value,
        htmlBody: htmlBody,
        textBody: textBody.value
      }
      try {
        let res = await API.graphql(graphqlOperation(createEmailTemplate, { input: payload }));
        let template = res.data.createEmailTemplate;
        console.log(template);
        setSelectedTempalte(template);
        emailTemalates.push(template);
        setHtmlBody(template.htmlBody);
      } catch {

      }
    } else {
      const payload = {
        id: selectedTempalte.id,
        name: subject.value,
        subject: subject.value,
        htmlBody: htmlBody,
        textBody: textBody.value
      }
      try {
        let res = await API.graphql(graphqlOperation(updateEmailTemplate, { input: payload }));
        let template = res.data.updateEmailTemplate;


        let newEmailTemalates = emailTemalates.filter(x => x.id != template.id);
        newEmailTemalates.push(template);
        console.log("emailTemplates", newEmailTemalates);
        setEmailTempaltes(newEmailTemalates);
        setSelectedTempalte(template);
        setHtmlBody(template.htmlBody);
      } catch (ex) {
        console.log(ex);
      }
    }


  }

  return (
    <Container fluid>
      <Row>
        <Col><br></br></Col>
      </Row>
      <Row>
        <Col><h5>Manage email templates</h5></Col>
      </Row>
      <Card>
        <Card.Body>

          <Row>
            <Col xs={6} md="auto">
              <Dropdown value={selectedTempalte.id}
              >
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedTempalte?.name ? selectedTempalte?.name : 'Select template'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {emailTemalates && emailTemalates.map(item => {
                    return <Dropdown.Item onClick={() => handleTemplateChange(item)} value={item.id} key={item.id}>{item.name}</Dropdown.Item>
                  })}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={6}>
              or &nbsp; &nbsp;
              <Button variant="info" type="submit" onClick={handleNewClick}>
                Create new
              </Button>
            </Col>
          </Row>
          <Row>
            <Col><br></br></Col>
          </Row>
          <Row>
            <Col><br></br></Col>
          </Row>
          <Row>
            <Col xs={12} lg="6">
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" onChange = {(event) => { setSubject(event.target.value) } } value={subject} placeholder="Enter subject" />
                  <Form.Text className="text-muted">
                    Subject line should be short and meaningful.
    </Form.Text>
                </Form.Group>

                <Form.Group controlId="htmlBody">
                  <Form.Label>Html Body</Form.Label>

                  <AppRitchTextEditor
                  isLoadHtmlBody = {isLoadHtmlBody}
                    defaultValue={htmlBody}
                    onChange={onHtmlBodyChange}
                  ></AppRitchTextEditor>
                </Form.Group>

                <Form.Group controlId="textBody">
                  <Form.Label>Text Body</Form.Label>
                  <Form.Control as="textarea" onChange = {(event) => { setTextBody(event.target.value) } } value={textBody} rows={3} />
                </Form.Group>


                <Form.Group>
                  <Form.File id="files" label="Attachment" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save
  </Button>
              </Form>
            </Col>
            <Col xs={12} lg="6">
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>

  );
}
