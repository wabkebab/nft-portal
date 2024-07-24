import axios from 'axios';
import FormData from 'form-data';

import { parseMultipartForm } from '../parseMultipartForm';

export const handler = async (event) => {
  const fields = await parseMultipartForm(event);
  const formData = new FormData();

  Object.keys(fields).forEach((key) => {
    if (key === 'file') {
      const { filename, content } = fields[key];
      formData.append(key, content, filename);
    } else {
      formData.append(key, fields[key]);
    }
  })

  try {
    const result = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', formData, {
      maxBodyLength: Infinity,
      headers: {
        Authorization: 'Bearer '+process.env.PINATA_API_KEY_SECRET,
        'Content-Type': 'application/json',
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_KEY_SECRET,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ipfsCid: result.data.IpfsHash }),
    };
  } catch (error) {
    console.log("Error while uploading to Image IPFS", error);
    return {
      statusCode: 404,
      body: error.toString(),
    };
  }
};
