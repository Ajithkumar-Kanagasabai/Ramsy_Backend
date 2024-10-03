const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const router = express.Router();

const app = express();
app.use(express.json());

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

// Vincere API credentials
const vincereHeaders = {
  'accept': 'application/json',
  'content-type': 'application/json',
  'id-token': 'eyJraWQiOiI5bHNyUXBsU1lXWDNXXC9CR0o1UjZWUzFKVmp3TjNMYUtyWjg5NTdMXC9UZlU9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoibF9OSnNMdjNnaTNwN2Z5Tkh2a09OUSIsInN1YiI6IjIzMGRiOWIwLTFmOTAtNDY0NS1hYjBjLTNhMDg5YmNlOTA2YSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfREZzUXA3bTdEIiwiY29nbml0bzp1c2VybmFtZSI6IkFjY2Vzc1ZpbmNlcmVfOGI3ZDlhMGItY2YxOS00MzliLTk1ZWItZTFmMWI1OTg3MjhjIiwibm9uY2UiOiJYMVgtNTdjZ2N4bnFad1hUOGNqa21iXzBTRTFSWFBWZ19iSkxncW1zNHVjRURySTRRbGQ2MVgyak5VRlZqN1VUaWxDVC1yeW84SllMUVZlckxrX3pXd2xJR1I0dEJ2TlFka0ZEQmNER3JqaEpKMHQzbWZCUDE5YjZ0ZzZQSVk2bmJPX0tld0RkNHc0WmUyRmZ1YnRyOGV3NTJIUlZ5MHFZcjUtVDUzc1p2LWsiLCJhdWQiOiI3YnM4MDBjZ2diZWxjNjgxdXU1MTc1b2tibyIsImlkZW50aXRpZXMiOlt7InVzZXJJZCI6IjhiN2Q5YTBiLWNmMTktNDM5Yi05NWViLWUxZjFiNTk4NzI4YyIsInByb3ZpZGVyTmFtZSI6IkFjY2Vzc1ZpbmNlcmUiLCJwcm92aWRlclR5cGUiOiJPSURDIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTcyNjg0Mzk4NzY0MCJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3Mjc3NzgyMjYsImV4cCI6MTcyNzc4MTgyNiwiaWF0IjoxNzI3Nzc4MjI2LCJlbWFpbCI6ImdvcGkua3VtYXJAZ3JldGhlbmEuY29tIn0',
  'x-api-key': '79f19895-e400-431e-9abf-6e30a7470a10'
};

// Create a candidate and upload file
app.post('/api/form', upload.single('resume'), async (req, res) => {
  const { fullName, email, phoneNumber, message } = req.body;
  const resumeFile = req.file;

  try {
    const [firstName, lastName] = fullName.split(' ');

    // Step 1: Create the candidate
    const createCandidateResponse = await axios.post('https://rhc.vincere.io/api/v2/candidate', {
      candidate_source_id: 29089,
      email: email,
      first_name: firstName,
      last_name: lastName,
      registration_date: new Date().toISOString()
    }, {
      headers: vincereHeaders
    });

    const candidateId = createCandidateResponse.data.id;
    console.log(`Candidate created with ID: ${candidateId}`);

    // Step 2: Upload the file to the created candidate
    if (resumeFile) {
      const fileData = new FormData();
    fileData.append('file_name', 'ipsum.docx');
    fileData.append('document_type_id', 1);
    fileData.append('url', 'https://abc.vincere.io/ipsum.docx');
    fileData.append('base_64_content', '');
    fileData.append('original_cv', true);
    fileData.append('expiry_date', '2018-04-05T00:00:00.000Z');

      const fileUploadResponse = await axios.post(
        `https://rhc.vincere.io/api/v2/candidate/${candidateId}/file`,
        fileData,
        {
          headers: {
            'id-token': vincereHeaders['id-token'],
            'x-api-key': vincereHeaders['x-api-key'],
            ...fileData.getHeaders(),
          },
        }
      );

      console.log('File uploaded successfully');
    }

    res.status(200).json({ message: 'Candidate created and file uploaded successfully' });
  } catch (error) {
    console.error('Error creating candidate or uploading file:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }

    res.status(500).json({ error: 'An error occurred while processing your request' });
  } finally {
    if (resumeFile) {
      fs.unlinkSync(resumeFile.path);  // Clean up uploaded file
    }
  }
});

module.exports = router;
