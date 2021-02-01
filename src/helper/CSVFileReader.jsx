
import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table'
import { CSVReader } from 'react-papaparse'

import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'
import ProgressBar from 'react-bootstrap/ProgressBar'

const buttonRef = React.createRef()


export default function CSVFileReader() {

  const [showToaster, setshowToaster] = useState(false);
  const showToast = () => setshowToaster(true);
  const hideToast = () => setshowToaster(false);

  const [showProgress, setshowProgress] = useState(false);

  const [serverTableKeys, setServerTableKeys] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [textAreVal, setTextAreaVal] = useState("Loading ........");


  useEffect(() => {
    const formSend = async () => {


      let res = await fetch(`https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/visit?getAllClient=${true}`);

      res.json().then((data) => {
        let userData;
        if (data.body) {
          let dataBody = JSON.parse(data.body);

          let keys = Object.keys(dataBody[0]);
          setServerTableKeys(keys);

          let text = '';
          keys.map(key => {
            text += key+ " ";
          });
          text.trim();
          text += "\n"

          dataBody.map((x) => {
            for (let i = 0; i < keys.length; i++) {
              text += x[keys[i]] + " ";
            }
            text.trim();
            text += "\n"
          });

          setTextAreaVal(text.slice(0, -1));
        }
      })
    };
    formSend();
  }, []);


  const handleOpenDialog = (e) => {
    hideToast();
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  const handleOnFileLoad = async (data) => {
    hideToast();

    setFileData(data);

    let text = '';
    data.map((x) => {
      x.data.map(y=>{
        text += y + " ";
      })
      text.trim();
      text += "\n"
    });

    setTextAreaVal(text.slice(0, -1));
  }

  const handleUploadFile = async () => {
    hideToast();
    setshowProgress(true);


    const rawResponse = await fetch('https://i6smufsvj6.execute-api.us-east-1.amazonaws.com/live/csvupload', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileData)
    });
    const content = await rawResponse.json();

    if (content.statusCode == 200) {
      console.log(fileData);
      setServerTableKeys(fileData[0].data);
      showToast();
      setshowProgress(false);
    }
  }

  const handleOnError = (err, file, inputElem, reason) => {
    setshowProgress(false);

  }

  const handleOnRemoveFile = (data) => {
    hideToast();

    setFileData(null);
  }

  const handleRemoveFile = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.removeFile(e)
    }
  }

  const handleValChange = (e) => {
    setTextAreaVal(e.target.value);
  }

  const handlePreview = () => {
    if(textAreVal.length<1) {
      setFileData(null);
      return;}

    let data = [];
    var lines = textAreVal.split('\n');
    for (var i = 0; i < lines.length; i++) {
      let _data = lines[i].trim().split(' ');
      data.push({ data: _data });
    }

    setFileData(data);
  }


  return (
    <div className="fileuploader-contaner">
      <div className="heading"><h6>Browse & upload</h6></div>
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
        noClick
        noDrag
        onRemoveFile={handleOnRemoveFile}
      >
        {({ file }) => (
          <div className="filecontrol-container">
            <aside
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 20,
                marginTop: 5,
              }}
            >

              <button
                type='button'
                onClick={handleOpenDialog}
                style={{
                  // borderRadius: 0,
                  // marginLeft: 0,
                  // marginRight: 0,
                  // width: '40%',
                  // paddingLeft: 0,
                  // paddingRight: 0
                }}
              >
                Browse file
            </button>
              <div
                style={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#ccc',
                  height: 45,
                  lineHeight: 2.5,
                  marginTop: 5,
                  marginBottom: 5,
                  paddingLeft: 13,
                  paddingTop: 3,
                  width: '60%'
                }}
              >
                {file && file.name}
              </div>

            </aside>
            <div className="textarea-container">
              <div className="heading"><h6>Paste & upload</h6></div>
              <textarea rows='3' value={textAreVal}
                onChange={handleValChange}
                className='textarea'>
              </textarea>
              <Button variant="primary" onClick={handlePreview}>Preview</Button>
            </div>
          </div>
        )}

      </CSVReader>

      <div>
        {showProgress && <ProgressBar animated striped variant="success" now={100} />}
        {fileData && <div className="margin-b-10 margin-t-10">
          <Button variant="danger" onClick={handleRemoveFile}>Remove</Button> <Button onClick={handleUploadFile} variant="success">Upload</Button></div>}
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              {fileData && (fileData[0]?.data).map(key=>{
               return <th key={key} className={!serverTableKeys?.includes(key.toLowerCase())?'red-bg': 'green-bg'}>{!serverTableKeys?.includes(key.toLowerCase()) && <span className="remove-icon"></span>}{key}</th>
              })}
             
            </tr>
          </thead>
          <tbody>
            {fileData?.slice(1).map((x, i) => {
              return <tr key={i}>
                <td>{i + 1}</td>
                {x.data.map((value, i)=>{
                  return  <td key={i}>{value}</td>
                })}               
              </tr>
            })}
          </tbody>
        </Table>
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
          <Toast.Body>File uploaded successfully!</Toast.Body>
        </Toast>

      </div>


    </div>


  )
}
