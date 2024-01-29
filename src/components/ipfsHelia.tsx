import { createHelia } from 'helia'
import { dagCbor } from '@helia/dag-cbor';


// Create an instance of Helia
// This will be used to add and get data from IPFS
const helia = await createHelia();
const d = dagCbor(helia);


// Add data to IPFS
// Returns the CID of the data
async function addDataToIPFS(data : any) {
    const cid = await d.add(data);
    return cid;
}


// Get data from IPFS using CID
// Returns the data
async function getDataFromIPFS(cid) {
    const data = await d.get(cid);
    return data;
}


export { addDataToIPFS, getDataFromIPFS };

// Usage Examples
/* 
// Storing a Medical Record
const medicalRecord = {
    patientAddress: '12345',
    doctorAddress: '67890',
    reportDetails: 'Report here...',
    // ... other fields ...
};
const recordCID = await addDataToIPFS(medicalRecord);  // Store `recordCID` in the smart contract or another database

// Retrieving a Medical Record
const recordCID = '...'; // CID fetched from the smart contract or database
const medicalRecord = await getDataFromIPFS(recordCID);
console.log(medicalRecord);

// Storing Different Types of Data
const patientInfo = { name: 'John Doe', age: 30, ... };
const infoCID = await addDataToIPFS(patientInfo);
Later... const retrievedInfo = await getDataFromIPFS(infoCID); 
*/
