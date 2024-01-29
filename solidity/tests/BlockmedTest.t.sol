// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import {Test} from "../lib/forge-std/src/Test.sol";
import {BlockMedSecure} from "../src/BlockMedSecure.sol";

contract BlockMedSecureTest is Test {
    BlockMedSecure public blockMedSecure;

    address public admin = address(1);
    address public doctor = address(2);
    address public patient = address(3);

    function setUp() public {
        blockMedSecure = new BlockMedSecure();
    }

    
    function testAddDoctor() public {
    // Add a new doctor
        blockMedSecure.addDoctor(doctor, "Dr. Smith", 10, "Cardiology");
        vm.startPrank(admin);
    // Retrieve doctor information
        (address walletAddress, BlockMedSecure.DoctorInfo memory doctorInfo) = blockMedSecure.doctors(doctor);

    // Create a Doctor struct
        BlockMedSecure.Doctor memory addedDoctor = BlockMedSecure.Doctor({
            walletAddress: walletAddress,
            doctorInfo: doctorInfo,
            reportsHistory: new string[](0)
        });

    // Accessing individual properties of the Doctor struct
        string memory doctorName = addedDoctor.doctorInfo.name;
        uint256 timeExperience = addedDoctor.doctorInfo.timeExperience;
        string memory specialty = addedDoctor.doctorInfo.specialty;

    // Asserting the values
        assertEq(addedDoctor.walletAddress, doctor);
        assertEq(doctorName, "Dr. Smith");
        assertEq(timeExperience, 10);
        assertEq(specialty, "Cardiology");
        vm.stopPrank();
    }


    function testAddPatient() public {    
    // Add a new patient
        blockMedSecure.addPatient(patient, "No pre-illness", "Aspirin", "None");
        vm.startPrank(admin);
    // Retrieve patient information
        (address walletAddress, BlockMedSecure.PatientInfo memory patientInfo) = blockMedSecure.patients(patient);
    
    // Create a Patient struct
        BlockMedSecure.Patient memory addedPatient = BlockMedSecure.Patient({
            walletAddress: walletAddress,
            patientInfo: patientInfo,
            medicalHistory: new string[](0),
            testResults: new string[](0)
        });

    // Accessing individual properties of the Patient struct
        string memory preIllness = addedPatient.patientInfo.preIllness;
        string memory medications = addedPatient.patientInfo.medications;
        string memory allergies = addedPatient.patientInfo.allergies;

    // Asserting the values
        assertEq(addedPatient.walletAddress, patient);
        assertEq(preIllness, "No pre-illness");
        assertEq(medications, "Aspirin");
        assertEq(allergies, "None");
        vm.stopPrank();
    }

    function testWriteMedicalReport() public {
    // Add a doctor first
        blockMedSecure.addDoctor(doctor, "Dr. Johnson", 5, "Pediatrics");

    // Set the doctor as the sender
        vm.startPrank(doctor);

    // Now, the doctor can write a medical report
        blockMedSecure.writeMedicalReport(patient, 1, "2024-01-20", "ipfs-hash-123");

        vm.stopPrank();
    }

    function testGetMedicalReports() public {
        vm.startPrank(doctor);
        blockMedSecure.getMedicalReports(patient);
        vm.stopPrank();
    }
}

