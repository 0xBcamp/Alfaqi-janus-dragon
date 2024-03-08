// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol"; 

/** * @title HealthcareContract * 
    * @dev A smart contract for managing healthcare-related data on the Ethereum blockchain. 
*/

contract BlockMedSecure is Ownable { 
    
    // Struct to store information about a doctor 
    struct Doctor { 
        address walletAddress; 
        DoctorInfo doctorInfo; 
        string[] activePatients; 
        string[] reportsHistory; 
    } 

    // Struct to store details about a doctor's professional information 
    
    struct DoctorInfo { 
        string name; 
        string email; 
        uint256 timeExperience; 
        string specialty; 
        bool emergencyAppointment; 
        string availableTime; 
    } 
    
    // Struct to store information about a patient 
    
    struct Patient { 
        address walletAddress; 
        PatientInfo patientInfo; 
        string[] medicalHistory; 
        string[] testResults; 
        mapping(address => bool) permissions; 
    }
     
    // Struct to store details about a patient's personal information 
    
    struct PatientInfo { 
        string preIllness; 
        string medications; 
        string allergies; 
    } 
    
    // Struct to store details about a medical report 
    
    struct MedicalReport { 
        address patientAddress; 
        address doctorAddress; 
        uint256 reportNumber; 
        string reportDate; 
        string ipfsHash;     // Store IPFS hash instead of medicalReport 
    } 

    ///////////////////
    // State Variables 
    ///////////////////


    address[] public doctorAddresses; 
    
    // Mappings to associate addresses with corresponding data structures 
    
    mapping(address => Doctor) public doctors; 
    mapping(address => Patient) public patients; 
    mapping(address => MedicalReport[]) public medicalReports; 
    
    ///////////////////
    // Events 
    /////////////////// 
    
    // Events to notify when certain actions occur

    event DoctorAdded(address walletAddress, string name, string specialty); 
    event PatientAdded(address walletAddress, string preIllness, string medications, string allergies); 
    event MedicalReportAdded(address patientAddress, address doctorAddress, uint256 reportNumber, string reportDate, string ipfsHash); 
    
    ///////////////////
    // Modifiers 
    /////////////////// 
    
    // Modifiers to control access to specific functions 
    
    modifier onlyVerifiedDoctor() { 
        require(doctors[msg.sender].walletAddress == msg.sender, "Only verified doctors can call this function"); 
        _; 
    } 
    modifier onlyVerifiedPatient() { 
        require(patients[msg.sender].walletAddress == msg.sender, "Only verified patients can call this function"); 
        _; 
    } 
    modifier onlyPatientOrAuthorizedDoctor(address patientAddress) { 
        require(patients[patientAddress].permissions[msg.sender] == true || msg.sender == patientAddress, "You don't have permission to access this patient's data"); 
        _;
    } 

    /** * @dev Constructor function to initialize the contract deployer as the owner. 
    * */ 
    
    
    constructor() Ownable(msg.sender) {
        
    }

    /////////////////// 
    // Admin Functions 
    /////////////////// 

    /**
     * @dev Function to transfer ownership of the contract to a new owner.
     * @param newOwner The address of the new owner.
     */
    function transferContractOwnership(address newOwner) external onlyOwner {
        super.transferOwnership(newOwner);
    }
     
    /////////////////// 
    // Functions 
    /////////////////// 

    /** * @dev Function to add a new doctor to the system. 
    * @param walletAddress The Ethereum address of the doctor. 
    * @param name The name of the doctor. 
    * @param timeExperience The number of years of experience. 
    * @param specialty The medical specialty of the doctor. */ 
    
    function addDoctor( address walletAddress, string memory name, string memory email, uint256 timeExperience, string memory specialty, bool emergencyAppointment, string memory availableTime ) external onlyOwner {
        
        // Check if the doctor already exists
        require(doctors[walletAddress].walletAddress != walletAddress, "Doctor already exists");
            
        DoctorInfo memory newDoctorInfo = DoctorInfo({
            name: name,
            email: email,
            timeExperience: timeExperience,
            specialty: specialty,
            emergencyAppointment: emergencyAppointment,
            availableTime: availableTime
        });

        // Directly assign a new Doctor struct to the mapping using walletAddress as the key
        doctors[walletAddress] = Doctor({
            walletAddress: walletAddress, // This line is technically redundant and can be omitted
            doctorInfo: newDoctorInfo,
            activePatients: new string[](0),
            reportsHistory: new string[](0)
        });

        doctorAddresses.push(walletAddress);

        emit DoctorAdded(walletAddress, name, specialty);   
    } 

    /** * @dev Function to add a new patient to the system. 
        * @param walletAddress The Ethereum address of the patient. 
        * @param preIllness Information about the patient's pre-illness state. 
        * @param medications Current medications of the patient. 
        * @param allergies Any allergies the patient has. 
    */ 
    
    function addPatient( address walletAddress, string memory preIllness, string memory medications, string memory allergies ) external onlyOwner {    
                
        // Check if the patient already exists
        require(patients[walletAddress].walletAddress != walletAddress, "Patient already exists");
        
        // Create the patientInfo struct first
        PatientInfo memory newPatientInfo = PatientInfo({
            preIllness: preIllness,
            medications: medications,
            allergies: allergies
        });

        //0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95

        // Add the patient to the mapping
        // Since we can't set the mapping in a constructor, we don't try to set it here
    
        Patient storage newPatient = patients[walletAddress];
        newPatient.walletAddress = walletAddress;
        newPatient.patientInfo = newPatientInfo;
        newPatient.medicalHistory = new string[](0);
        newPatient.testResults = new string[](0);
    
        // The permissions mapping is implicitly initialized to its default values

        emit PatientAdded(walletAddress, preIllness, medications, allergies);
    } 

    /** * @dev Function for a doctor to write a medical report for a patient. 
        * @param patientAddress The Ethereum address of the patient. 
        * @param reportNumber The number associated with the medical report. 
        * @param reportDate The date when the medical report was created. 
        * @param ipfsHash The IPFS hash referencing the actual medical report. 
    */ 
    
    function writeMedicalReport( address patientAddress, uint256 reportNumber, string memory reportDate, string memory ipfsHash) external onlyVerifiedDoctor { 
        
        medicalReports[patientAddress].push(MedicalReport({ 
            patientAddress: patientAddress, 
            doctorAddress: msg.sender, 
            reportNumber: reportNumber, 
            reportDate: reportDate, 
            ipfsHash: ipfsHash 
        })); 
    
        doctors[msg.sender].reportsHistory.push(ipfsHash); 
        emit MedicalReportAdded(patientAddress, msg.sender, reportNumber, reportDate, ipfsHash); 
    }

    /** * @dev Function for a patient to give permission to a doctor to access their medical data. 
        * @param patientAddress The Ethereum address of the patient.
        * @param doctorAddress The Ethereum address of the doctor. 
    */
    function grantPermissionToDoctor(address patientAddress, address doctorAddress) external {
        // Ensure only the patient or an authorized entity can grant permission
    
        require(msg.sender == patientAddress, "Only the patient can grant access");
        patients[patientAddress].permissions[doctorAddress] = true;
    }

    /** * @dev Function for a patient to revoke permission from a doctor to access their medical data. 
        * @param patientAddress The Ethereum address of the patient. 
        * @param doctorAddress The Ethereum address of the doctor. 
    */
    function revokePermissionFromDoctor(address patientAddress, address doctorAddress) external {
        // Ensure only the patient or an authorized entity can revoke permission
        
        require(msg.sender == patientAddress, "Only the patient can revoke access");
        patients[patientAddress].permissions[doctorAddress] = false;
    } 
    
    /////////////////// 
    // Getter Functions 
    /////////////////// 

    /** * @dev Function to retrieve all medical reports for a given patient. 
     *  * @param patientAddress The Ethereum address of the patient 
     *  * @return An array of MedicalReport structs representing the patient's medical reports. 
    */ 

    function getMedicalReports(address patientAddress) external view onlyPatientOrAuthorizedDoctor(patientAddress) returns (MedicalReport[] memory) { 
        return medicalReports[patientAddress];
    } 

    /** * @dev Function to retrieve patient information. 
     *  * @param patientAddress The Ethereum address of the patient. 
     *  * @return The patient's information. 
     *  */ 

    function getPatientInfo(address patientAddress) external view onlyPatientOrAuthorizedDoctor(patientAddress) returns (PatientInfo memory) { 
        return patients[patientAddress].patientInfo; 
    } 


    /** * @dev Function to retrieve patient permissions information. 
     *  * @param patientAddress The Ethereum address of the patient. 
     *  * @return Doctor that have permission to access the patient's data. 
     *  */ 

    function getPatientPermissions(address patientAddress) external view onlyPatientOrAuthorizedDoctor(patientAddress) 
        returns (address[] memory) { 
        uint256 count;
        
        // Count the number of doctors with access
        
        for (uint256 i = 0; i < doctorAddresses.length; i++) {
            if (patients[patientAddress].permissions[doctorAddresses[i]]) {
                count++;
            }
        }
    
        // Create an array to hold the doctor addresses
        
        address[] memory permissionedDoctors = new address[](count);
    
        // Populate the array with the addresses of doctors with access
    
        uint256 index;
        for (uint256 i = 0; i < doctorAddresses.length; i++) {
            if (patients[patientAddress].permissions[doctorAddresses[i]]) {
                permissionedDoctors[index] = doctorAddresses[i];
                index++;
            }
        }
        return permissionedDoctors;
    }


    /** * @dev Function to retrieve patient test results. 
     *  * @param patientAddress The Ethereum address of the patient. 
     *  * @return An array with patient's test results hashes. 
     *  */ 

    function getPatientTestResults(address patientAddress) external view onlyPatientOrAuthorizedDoctor(patientAddress) returns (string[] memory) { 
        return patients[patientAddress].testResults; 
    } 

    /** * @dev Function to retrieve all medical reports for a given doctor. 
     *  * @return An array of MedicalReport hashes representing the doctor medical reports history stored in IPFS. 
     *  */ 

    function getDoctorReportsHistory() external view returns (string[] memory) { 
    
        require(doctors[msg.sender].walletAddress == msg.sender, "Doctor not found"); 
        return doctors[msg.sender].reportsHistory; 
    
    } 

    /** * @dev Function to retrieve doctor information. 
     *  * @param doctorAddress The Ethereum address of the doctor. 
     *  * @return The doctor's information. 
     *  */

    function getDoctorInfo(address doctorAddress) external view returns (DoctorInfo memory) { 
        require(doctors[doctorAddress].walletAddress == doctorAddress, "Doctor not found");
        return doctors[doctorAddress].doctorInfo; 
    } 

    /** * @dev Function to retrieve all doctors addresses. 
     *  * @return An array of all doctors adresses in the system. 
     *  */

    function getAllDoctors() external view returns (Doctor[] memory) { 
        Doctor[] memory allDoctors = new Doctor[](doctorAddresses.length); 
        for (uint256 i = 0; i < doctorAddresses.length; i++) { 
                address doctorAddress = doctorAddresses[i]; 
                allDoctors[i] = doctors[doctorAddress]; 
            } 
            return allDoctors; 
    } 
        
        /** * @dev Function to retrieve doctor active patients. 
        *     @return An array of all active patients for a doctor. 
        * */ 

    function getActivePatients() external view onlyVerifiedDoctor returns (string[] memory) { 
        return doctors[msg.sender].activePatients; 
    }
}