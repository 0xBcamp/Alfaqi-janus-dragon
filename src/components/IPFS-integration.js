import React, { useState } from 'react';
import { ethers } from 'ethers';
//import ipfsHttpClient from 'ipfs-http-client';
import('ipfs-http-client').then(ipfsHttpClient => {
  // Your code that uses ipfsHttpClient goes here
}).catch(error => {
  console.error('Error loading IPFS HTTP client:', error);
});

const App = () => {
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      const ipfs = ipfsHttpClient({
        host: 'ipfs.filebase.com',
        port: 443,
        protocol: 'https'
      });
      
      try {
        const ipfsResult = await ipfs.add(reader.result);
        setIpfsHash(ipfsResult.path);

        const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
        const signer = provider.getSigner();
        const contractAddress = '0xcc2C620f303fFEea26B632Fa3bD6642a0e436Df0'; // Replace with your contract address
        const contractABI = [[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"walletAddress","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"specialty","type":"string"}],"name":"DoctorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"patientAddress","type":"address"},{"indexed":false,"internalType":"address","name":"doctorAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"reportNumber","type":"uint256"},{"indexed":false,"internalType":"string","name":"reportDate","type":"string"},{"indexed":false,"internalType":"string","name":"ipfsHash","type":"string"}],"name":"MedicalReportAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"walletAddress","type":"address"},{"indexed":false,"internalType":"string","name":"preIllness","type":"string"},{"indexed":false,"internalType":"string","name":"medications","type":"string"},{"indexed":false,"internalType":"string","name":"allergies","type":"string"}],"name":"PatientAdded","type":"event"},{"inputs":[{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"timeExperience","type":"uint256"},{"internalType":"string","name":"specialty","type":"string"},{"internalType":"bool","name":"emergencyAppointment","type":"bool"},{"internalType":"string","name":"availableTime","type":"string"}],"name":"addDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"walletAddress","type":"address"},{"internalType":"string","name":"preIllness","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"allergies","type":"string"}],"name":"addPatient","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"doctorAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"doctors","outputs":[{"internalType":"address","name":"walletAddress","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"timeExperience","type":"uint256"},{"internalType":"string","name":"specialty","type":"string"},{"internalType":"bool","name":"emergencyAppointment","type":"bool"},{"internalType":"string","name":"availableTime","type":"string"}],"internalType":"struct BlockMedSecure.DoctorInfo","name":"doctorInfo","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getActivePatients","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllDoctors","outputs":[{"components":[{"internalType":"address","name":"walletAddress","type":"address"},{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"timeExperience","type":"uint256"},{"internalType":"string","name":"specialty","type":"string"},{"internalType":"bool","name":"emergencyAppointment","type":"bool"},{"internalType":"string","name":"availableTime","type":"string"}],"internalType":"struct BlockMedSecure.DoctorInfo","name":"doctorInfo","type":"tuple"},{"internalType":"string[]","name":"activePatients","type":"string[]"},{"internalType":"string[]","name":"reportsHistory","type":"string[]"}],"internalType":"struct BlockMedSecure.Doctor[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"doctorAddress","type":"address"}],"name":"getDoctorInfo","outputs":[{"components":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"timeExperience","type":"uint256"},{"internalType":"string","name":"specialty","type":"string"},{"internalType":"bool","name":"emergencyAppointment","type":"bool"},{"internalType":"string","name":"availableTime","type":"string"}],"internalType":"struct BlockMedSecure.DoctorInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDoctorReportsHistory","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getMedicalReports","outputs":[{"components":[{"internalType":"address","name":"patientAddress","type":"address"},{"internalType":"address","name":"doctorAddress","type":"address"},{"internalType":"uint256","name":"reportNumber","type":"uint256"},{"internalType":"string","name":"reportDate","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"internalType":"struct BlockMedSecure.MedicalReport[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientInfo","outputs":[{"components":[{"internalType":"string","name":"preIllness","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"allergies","type":"string"}],"internalType":"struct BlockMedSecure.PatientInfo","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientPermissions","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"}],"name":"getPatientTestResults","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"},{"internalType":"address","name":"doctorAddress","type":"address"}],"name":"grantPermissionToDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"medicalReports","outputs":[{"internalType":"address","name":"patientAddress","type":"address"},{"internalType":"address","name":"doctorAddress","type":"address"},{"internalType":"uint256","name":"reportNumber","type":"uint256"},{"internalType":"string","name":"reportDate","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"patients","outputs":[{"internalType":"address","name":"walletAddress","type":"address"},{"components":[{"internalType":"string","name":"preIllness","type":"string"},{"internalType":"string","name":"medications","type":"string"},{"internalType":"string","name":"allergies","type":"string"}],"internalType":"struct BlockMedSecure.PatientInfo","name":"patientInfo","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"},{"internalType":"address","name":"doctorAddress","type":"address"}],"name":"revokePermissionFromDoctor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferContractOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"patientAddress","type":"address"},{"internalType":"uint256","name":"reportNumber","type":"uint256"},{"internalType":"string","name":"reportDate","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"writeMedicalReport","outputs":[],"stateMutability":"nonpayable","type":"function"}]];
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        await contract.storeIPFSHash(ipfsResult.path);

        // Update file list
        const fileCount = await contract.getFileCount();
        const newFileList = [];
        for (let i = 0; i < fileCount; i++) {
          const fileInfo = await contract.getFile(i);
          newFileList.push(fileInfo);
        }
        setFileList(newFileList);
      } catch (err) {
        setError(err.message || 'An error occurred while uploading the file.');
      } finally {
        setLoading(false);
      }
    };
  };

  const fetchFile = async (ipfsHash) => {
    const ipfs = ipfsHttpClient({
      host: 'ipfs.filebase.com',
      port: 443,
      protocol: 'https'
    });

    try {
      const fileBuffer = await ipfs.cat(ipfsHash);
      const fileBlob = new Blob([fileBuffer]);
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the file.');
    }
  };

  return (
    <div>
      <h1>Upload File to IPFS and Ethereum</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={!file || loading}>Upload</button>
      {loading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {ipfsHash && <p>IPFS Hash: {ipfsHash}</p>}
      <h2>Uploaded Files:</h2>
      <ul>
        {fileList.map((file, index) => (
          <li key={index}>
            <span>{file[0]}</span>
            <button onClick={() => fetchFile(file[0])}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
