import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import ProgressBar from 'react-bootstrap/ProgressBar'
import AppRitchTextEditor from '../../helper/appRitchTextEditor';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify'
import { onUpdateClientQuery } from '../../graphql/subscriptions'
import { updateClientQuery, createClientQuery } from '../../graphql/mutations'
import Toast from 'react-bootstrap/Toast'
import { listClientQuerys } from '../../graphql/queries'
import awsExports from '../../aws-exports';
Amplify.configure({
  ...awsExports,
  Analytics: {
    disabled: true
  }
});


export default function Clients({ }) {


  const [clients, setClients] = useState(null);
  const [lstQueries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState({});
  const [query, setQuery] = useState();
  const [name, setName] = useState();
  const [showProgress, setshowProgress] = useState(false);
  const [showToaster, setshowToaster] = useState(false);
  const showToast = () => setshowToaster(true);
  const hideToast = () => setshowToaster(false);

  useEffect(() => {
    formSend();
  }, []);

  const formSend = async (params = null) => {
    setshowProgress(true);
    let url = `https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?getAllClient=${true}`;

    if (params) {
      var newStr = params.replace(/{/g, '~');
      let anotherString = newStr.replace(/}/g, ';');
      url += `&params=${anotherString}`;
    }
    try {
      let res = await fetch(url);

      res.json().then((data) => {
        let userData;
        if (data.body) {
          let dataBody = JSON.parse(data.body);
          setClients(dataBody);
          console.log(dataBody);
        }
        setshowProgress(false);
      }).catch(err => {
        setshowProgress(false);
        handleClear();
      })
    } catch {
      setshowProgress(false);
      handleClear();
    }
  };

  const getMaxKeyItemKeys = (array) => {
  if(array && array.length>0)
  {
    let keyCount = 0;
    let itemToReturn = null;

    array.forEach(item => {
      let totalKeys = Object.keys(item).length;
      if (keyCount < totalKeys) {
        keyCount = totalKeys;
        itemToReturn = item;
      }
    });

    return Object.keys(itemToReturn);
  }else{
  return [];
  }

  }

  useEffect(() => {

    const req = async () => {
      try {
        let res = await API.graphql(graphqlOperation(listClientQuerys));
        setQueries(res.data.listClientQuerys?.items);
      } catch {

      }
    };

    req();
  }, []);

  const handleQueryChange = async (item) => {

    setName(item.name);
    setQuery(item.query);
    setSelectedQuery(item);

  }

  const handleNewClick = async () => {

    setName('');
    setQuery('');
    setSelectedQuery({});
  }



  const handleSaveClick = async () => {

    if(!name || name==''){
      return;
    }
    setshowProgress(true);
    hideToast();
    let payload = {
      name: name,
      query: query,
    }


    if (!selectedQuery?.id) {
      try {
        let res = await API.graphql(graphqlOperation(createClientQuery, { input: payload }));
        let query = res.data.createClientQuery;

        let allQueries = lstQueries;
        allQueries.push(query)
        setQueries(allQueries);
        setSelectedQuery(query);

      } catch (ex) {
        console.log(ex);
      }
    } else {
      payload['id'] = selectedQuery?.id;
      try {
        let res = await API.graphql(graphqlOperation(updateClientQuery, { input: payload }));
        let query = res.data.updateClientQuery;
        let allQueries = lstQueries.filter(x => x.id != query.id);
        allQueries.push(query);
        setQueries(allQueries);
        setSelectedQuery(query);
      } catch (ex) {
        console.log(ex);
      }
    }

    setshowProgress(false);
    showToast();
  }

  const handleClear = () => {
    setClients(null);
  }



  const submitHandler = async (event) => {
    event.preventDefault();

    console.log(name, query);
    if (query && query != '') {
      formSend(query);
    } else {
      formSend();
    }
  }

  return (
    <div>

      <Container fluid>
        <Row>
          <Col><br></br></Col>
        </Row>
        <Row>
          <Col><h5>Search clients</h5></Col>
        </Row>
        <Card>
          <Card.Body>

            <Row>
              <Col xs={6} md="auto">
                <Dropdown value={selectedQuery.id}
                >
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {selectedQuery?.name ? selectedQuery?.name : 'Select query'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {lstQueries && lstQueries.map(item => {
                      return <Dropdown.Item onClick={() => handleQueryChange(item)} value={item.id} key={item.id}>{item.name}</Dropdown.Item>
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={6}>
                or &nbsp; &nbsp;
              <Button variant="info" onClick={handleNewClick}>
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
                  <Card>
                    <Card.Body className="templateName">
                      <Form.Group controlId="name">
                        <Form.Label>Query Name</Form.Label>
                        <Form.Control type="text" onChange={(event) => { setName(event.target.value) }} value={name} />
                        <Form.Text className="text-muted">
                          Query Name will be visible in dropdown.
    </Form.Text>
                      </Form.Group>

                    </Card.Body>
                  </Card>
                  <br></br>

                  <Form.Group controlId="query">
                    <Form.Label>Query</Form.Label>
                    <Form.Control as="textarea" onChange={(event) => { setQuery(event.target.value) }} value={query} rows={3} />
                  </Form.Group>
                  <Row>
                    <Col xs={4} lg="4">
                      <Button variant="success" onClick={handleSaveClick}>
                        Save
              </Button>
                    </Col>
                    <Col xs={8} lg="8">
                      <Button variant="primary" type="submit" size="lg" block>
                        Search
                </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col><br></br></Col>
                  </Row>
                  <Row>
                    <Col>
                      {showProgress && <ProgressBar animated striped variant="success" now={100} />}
                    </Col>
                  </Row>
                  <Row>
                    <Col><br></br></Col>
                  </Row>
                </Form>
              </Col>
              <Col xs={12} lg="6">
              </Col>
            </Row>
            <Row>
              {clients &&
                <Col>
                  <h5>Search result:</h5>
                  <hr></hr>
                  <Button variant="danger" onClick={handleClear}>Clear</Button>
                  <br></br>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        {clients && (getMaxKeyItemKeys(clients)).map(key => {
                          return <th key={key} className='green-bg'>{key}</th>
                        })}

                      </tr>
                    </thead>
                    <tbody>
                      {clients && clients.map((x, i) => {
                        return <tr key={i}>
                          <td>{i + 1}</td>
                          {x && (Object.keys(x)).map((key, i) => {
                            return x[key] && <td key={i}>{x[key]}</td>
                          })}
                        </tr>
                      })}
                    </tbody>
                  </Table>
                </Col>
              }
            </Row>
          </Card.Body>
        </Card>

      </Container>
      <Toast className="toast-style" show={showToaster} onClose={hideToast}>
        <Toast.Header>
          <img
            src="holder.js/20x20?text=%20"
            className="rounded mr-2"
            alt=""
          />
          <strong className="mr-auto">Success</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>Query saved successfully!</Toast.Body>
      </Toast>
    </div>

  );
}
