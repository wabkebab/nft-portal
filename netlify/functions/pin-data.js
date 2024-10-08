import axios from 'axios';

export const handler = async (event) => {
  try {
    const result = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', event.body, {
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
    console.log("Error while uploading to Data IPFS", error);
    return {
      statusCode: 404,
      body: error.toString(),
    };
  }
};
