import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ProgressBar from 'react-bootstrap/ProgressBar'
import AppRitchTextEditor from '../../helper/appRitchTextEditor';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify'
import { onUpdateUserActivity } from '../../graphql/subscriptions'
import { updateEmailTemplate, createEmailTemplate } from '../../graphql/mutations'
import Toast from 'react-bootstrap/Toast'
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
  const [fileLink, setFileLink] = useState(null);
  const [subject, setSubject] = useState();
  const [isLoadHtmlBody, setHtmlBodyLoad] = useState(false);
  const [showProgress, setshowProgress] = useState(false);
  const [showToaster, setshowToaster] = useState(false);
  const showToast = () => setshowToaster(true);
  const hideToast = () => setshowToaster(false);



  useEffect(() => {

    const req = async () => {
      try {
        let res = await API.graphql(graphqlOperation(listEmailTemplates));
        setEmailTempaltes(res.data.listEmailTemplates?.items);
      } catch {

      }
    };

    req();
  }, []);

  const handleTemplateChange = async (item) => {
    hideToast();
    setshowProgress(false);
    setSubject(item.subject);
    setHtmlBody(item.htmlBody);
    setTextBody(item.textBody);

    setSelectedTempalte(item);

    setHtmlBodyLoad(true);

    if (item.id) {
      await getFile(item.id);     
    }

  }

  const handleDelete = async () =>{
    setshowProgress(true);
    await Storage.remove(selectedTempalte.id).then(result => {     
      setFileLink(null);
      setshowProgress(true);
     API.graphql(graphqlOperation(updateEmailTemplate, { input: {id: selectedTempalte.id, files: null} })).then((data)=>{
      setshowProgress(false);
     });     
    })
    .catch(err => {      
      setshowProgress(false);
    });;
  }

  const handleNewClick = () => {
    hideToast();
    setshowProgress(false);
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

  const uploadFile = async (key, file) => {
    Storage.put(key, file, {
      contentType: file.type
    })
      .then(result => {})
      .catch(err => console.log(err));
  }

  const getFile = async (key) => {
    Storage.get(key)
      .then(result => {
        setFileLink(result);
       
      })
      .catch(err => {       
        setFileLink(null);
      });
  }


  const submitHandler = async (event) => {
    event.preventDefault();
    hideToast();
    const { subject, textBody, files } = event.target.elements;
    if (subject == undefined || subject == '') {
      return;
    }
    
    setshowProgress(true);

    var file = null;
    var fileName;
    if (files.value) {
      file = files.files[0];
      fileName = files.value;
    }

    let payload = {
      name: subject.value,
      subject: subject.value,
      htmlBody: htmlBody,
      textBody: textBody.value,
    }

    if (fileName) {
      payload['files'] = JSON.stringify([{ fileName }]);
    }


    if (!selectedTempalte?.id) {
      try {
        let res = await API.graphql(graphqlOperation(createEmailTemplate, { input: payload }));
        let template = res.data.createEmailTemplate;
        setSelectedTempalte(template);
        emailTemalates.push(template);
        setHtmlBody(template.htmlBody);
        await uploadFile(template.id, file);
        setshowProgress(false);
        showToast();
      } catch {
        setshowProgress(false);
      }
    } else {

      payload['id'] = selectedTempalte.id;

      try {
        let res = await API.graphql(graphqlOperation(updateEmailTemplate, { input: payload }));
        let template = res.data.updateEmailTemplate;


        let newEmailTemalates = emailTemalates.filter(x => x.id != template.id);
        newEmailTemalates.push(template);
        setEmailTempaltes(newEmailTemalates);
        setSelectedTempalte(template);
        setHtmlBody(template.htmlBody);
        await uploadFile(template.id, file);
        setshowProgress(false);
        showToast();
      } catch (ex) {
        setshowProgress(false);
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
                  <Form.Control type="text" onChange={(event) => { setSubject(event.target.value) }} value={subject} placeholder="Enter subject" />
                  <Form.Text className="text-muted">
                    Subject line should be short and meaningful.
    </Form.Text>
                </Form.Group>

                <Form.Group controlId="htmlBody">
                  <Form.Label>Html Body</Form.Label>

                  <AppRitchTextEditor
                    isLoadHtmlBody={isLoadHtmlBody}
                    defaultValue={htmlBody}
                    onChange={onHtmlBodyChange}
                  ></AppRitchTextEditor>
                </Form.Group>

                <Form.Group controlId="textBody">
                  <Form.Label>Text Body</Form.Label>
                  <Form.Control as="textarea" onChange={(event) => { setTextBody(event.target.value) }} value={textBody} rows={3} />
                </Form.Group>


                <Form.Group>
                  <Form.File id="files" label="Attachment" />
                  <br></br>
                  {selectedTempalte.files && fileLink && <div>Uploaded file <a href={fileLink} target="blank">{JSON.parse(selectedTempalte.files)[0].fileName}</a> &nbsp;  <Button variant="danger" onClick={handleDelete}>
                  Remove
  </Button></div>}
                </Form.Group>
                <br>
                </br>
                {showProgress && <ProgressBar animated striped variant="success" now={100} />}

<br></br>
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
      <Toast style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'greenyellow'
        }} show={showToaster} onClose={hideToast}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Success</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body>Template saved successfully!</Toast.Body>
        </Toast>
    </Container>

  );
}
