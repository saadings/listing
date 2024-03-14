export function errorHtml(errorMessage: string) {
  return `
  <html>
    <head>
      <style>
        body {
          background-color: #333;
          color: #fff;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #e57373; /* Red to indicate error */
        }
        p {
          font-size: 16px;
        }
        .error-message {
          background-color: #422; /* Darker shade for error background */
          color: #f44336; /* Bright red for error text to stand out */
          padding: 10px;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <h1>Error: Excel File Upload Failed</h1>
      <p>There was an error during the file upload process. Please see the error details below and try again.</p>
      <div class="error-message">Error uploading file: ${errorMessage}</div>
    </body>
  </html>
  `;
}

export function fileUploadStartHtml() {
  return `
  <html>
    <head>
      <style>
        body {
          background-color: #333;
          color: #fff;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #4CAF50;
        }
        p {
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>Excel File Upload Started</h1>
      <p>We are starting the file upload process. You will receive another notification once the upload is complete.</p>
    </body>
  </html>
  `;
}

export function fileUploadEndHtml() {
  return `
  <html>
    <head>
      <style>
        body {
          background-color: #333;
          color: #fff;
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #FF9800;
        }
        p {
          font-size: 16px;
        }
      </style>
    </head>
    <body>
      <h1>Excel File Upload Completed</h1>
      <p>We are done uploading the files. Check the application for more details.</p>
    </body>
  </html>
  `;
}
