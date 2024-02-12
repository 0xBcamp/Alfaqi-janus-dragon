// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Appointments {
    struct Appointment {
        uint256 id;
        address patientAddress;
        address doctorAddress;
        uint256 timestamp; // Appointment time
        string reason; // Reason for the appointment
        bool confirmed; // Whether the appointment is confirmed by the doctor
    }

    uint256 private nextAppointmentId = 1;
    mapping(uint256 => Appointment) public appointments;
    mapping(address => uint256[]) public doctorAppointments;
    mapping(address => uint256[]) public patientAppointments;

    event AppointmentRequested(uint256 appointmentId, address patientAddress, address doctorAddress, uint256 timestamp, string reason);
    event AppointmentConfirmed(uint256 appointmentId, address doctorAddress);
    event AppointmentCancelled(uint256 appointmentId);

    // Function to request a new appointment
    function requestAppointment(address doctorAddress, uint256 timestamp, string memory reason) external {
        appointments[nextAppointmentId] = Appointment({
            id: nextAppointmentId,
            patientAddress: msg.sender,
            doctorAddress: doctorAddress,
            timestamp: timestamp,
            reason: reason,
            confirmed: false
        });

        patientAppointments[msg.sender].push(nextAppointmentId);
        doctorAppointments[doctorAddress].push(nextAppointmentId);

        emit AppointmentRequested(nextAppointmentId, msg.sender, doctorAddress, timestamp, reason);

        nextAppointmentId++;
    }

    // Function for doctors to confirm requested appointments
    function confirmAppointment(uint256 appointmentId) external {
        require(appointments[appointmentId].doctorAddress == msg.sender, "Only the appointed doctor can confirm this appointment");
        require(!appointments[appointmentId].confirmed, "Appointment is already confirmed");

        appointments[appointmentId].confirmed = true;

        emit AppointmentConfirmed(appointmentId, msg.sender);
    }

    // Function for doctors to reject appointments
    function rejectAppointment(uint256 appointmentId) external {
        require(appointments[appointmentId].doctorAddress == msg.sender, "Only the appointed doctor can reject this appointment");
        require(appointments[appointmentId].confirmed, "Appointment is not confirmed");

        appointments[appointmentId].confirmed = false;
        
        emit AppointmentRejected(appointmentId);
    }

    // Function for either party to cancel an appointment
    function cancelAppointment(uint256 appointmentId) external {
        require(
            appointments[appointmentId].patientAddress == msg.sender || appointments[appointmentId].doctorAddress == msg.sender,
            "Only the participating doctor or patient can cancel this appointment"
        );

        delete appointments[appointmentId];
        // Consider removing from patientAppointments and doctorAppointments arrays as well

        emit AppointmentCancelled(appointmentId);
    }

    // Function to get all confirmed appointments for a patient
    function getPatientAppointments() external view returns (uint256[] memory) {
        return patientAppointments[msg.sender];
    }

    // Function to get all confirmed appointments for a doctor
    function getDoctorAppointments() external view returns (uint256[] memory) {
        return doctorAppointments[msg.sender];
    }

    // Function to get all requested appointments for a doctor, returns an array of the requests
    function getDoctorRequests() external view returns (Appointment[] memory) {
        uint256[] memory appointmentIds = doctorAppointments[msg.sender];
        Appointment[] memory requests = new Appointment[](appointmentIds.length);

        for (uint256 i = 0; i < appointmentIds.length; i++) {
            requests[i] = appointments[appointmentIds[i]];
        }

        return requests;
    }
}
