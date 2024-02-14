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
    // Separate mappings for requested and confirmed appointments
    mapping(address => uint256[]) public doctorRequestedAppointments;
    mapping(address => uint256[]) public doctorConfirmedAppointments;
    mapping(address => uint256[]) public patientAppointments;

    event AppointmentRequested(uint256 appointmentId, address patientAddress, address doctorAddress, uint256 timestamp, string reason);
    event AppointmentConfirmed(uint256 appointmentId, address doctorAddress);
    event AppointmentCancelled(uint256 appointmentId);
    event AppointmentRejected(uint256 appointmentId);

    // Request a new appointment
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
        doctorRequestedAppointments[doctorAddress].push(nextAppointmentId);

        emit AppointmentRequested(nextAppointmentId, msg.sender, doctorAddress, timestamp, reason);

        nextAppointmentId++;
    }

    // Confirm requested appointments
    function confirmAppointment(uint256 appointmentId) external {
        require(appointments[appointmentId].doctorAddress == msg.sender, "Only the appointed doctor can confirm this appointment");
        require(!appointments[appointmentId].confirmed, "Appointment is already confirmed");

        appointments[appointmentId].confirmed = true;
        // Move appointment from requested to confirmed for the doctor
        _moveToConfirmed(appointmentId, appointments[appointmentId].doctorAddress);

        emit AppointmentConfirmed(appointmentId, msg.sender);
    }

    // Reject appointments
    function rejectAppointment(uint256 appointmentId) external {
        require(appointments[appointmentId].doctorAddress == msg.sender, "Only the appointed doctor can reject this appointment");
        require(!appointments[appointmentId].confirmed, "Appointment is already confirmed");

        _removeAppointment(appointmentId, appointments[appointmentId].doctorAddress, false); // false indicates not confirmed

        emit AppointmentRejected(appointmentId);
    }

    // Cancel an appointment
    function cancelAppointment(uint256 appointmentId) external {
        require(
            appointments[appointmentId].patientAddress == msg.sender || appointments[appointmentId].doctorAddress == msg.sender,
            "Only the participating doctor or patient can cancel this appointment"
        );

        bool isConfirmed = appointments[appointmentId].confirmed;
        if(isConfirmed) {
            _removeAppointment(appointmentId, appointments[appointmentId].doctorAddress, true); // true for confirmed
        } else {
            _removeAppointment(appointmentId, appointments[appointmentId].doctorAddress, false); // false for not confirmed
        }

        delete appointments[appointmentId];

        emit AppointmentCancelled(appointmentId);
    }

    // Get all requested appointments for a doctor
    function getDoctorRequestedAppointments() external view returns (uint256[] memory) {
        return doctorRequestedAppointments[msg.sender];
    }

    // Get all confirmed appointments for a doctor
    function getDoctorConfirmedAppointments() external view returns (uint256[] memory) {
        return doctorConfirmedAppointments[msg.sender];
    }

    // Get all appointments for a patient
    function getPatientAppointments() external view returns (uint256[] memory) {
        return patientAppointments[msg.sender];
    }

    // Helper function to move an appointment from requested to confirmed
    function _moveToConfirmed(uint256 appointmentId, address doctorAddress) private {
        _removeAppointment(appointmentId, doctorAddress, false); // Remove from requested
        doctorConfirmedAppointments[doctorAddress].push(appointmentId); // Add to confirmed
    }

    // Helper function to remove an appointment from the appropriate list
    function _removeAppointment(uint256 appointmentId, address doctorAddress, bool isConfirmed) private {
        uint256[] storage appointmentList = isConfirmed ? doctorConfirmedAppointments[doctorAddress] : doctorRequestedAppointments[doctorAddress];
        for (uint256 i = 0; i < appointmentList.length; i++) {
            if (appointmentList[i] == appointmentId) {
                appointmentList[i] = appointmentList[appointmentList.length - 1];
                appointmentList.pop();
                break;
            }
        }
    }
}