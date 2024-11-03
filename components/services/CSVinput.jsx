import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVinput = () => {
  const [csvData, setCsvData] = useState([]);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const contents = e.target.result;
      parseCSV(contents);
    };

    reader.readAsText(file);
  }

  function parseCSV(csvContent) {
    Papa.parse(csvContent, {
      complete: function (results) {
        setCsvData(results.data);
      },
    });
  }

  console.log(csvData);

  return (
    <div className='mt-4'>
      <input type="file" onChange={handleFileUpload} accept='.csv'/>
      {csvData.length > 0 && (
        <table className='table table-striped table-hover mt-4'>
          <thead className=' table-success'>
            <tr>
              {csvData[0].map((header, index) => (
                <th key={index} >{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CSVinput;

