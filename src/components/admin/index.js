import React, { useEffect } from 'react';
import CSVFileReader from '../../helper/CSVFileReader'

export default function Admin({}) {

  return (
    <div>
     <h4> &nbsp; &nbsp; Browse & upload</h4>     
     <CSVFileReader></CSVFileReader>
    </div>
  );
}
