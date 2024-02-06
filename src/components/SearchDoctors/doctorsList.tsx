import React from 'react';
import { Card, Title, Flex, Text } from '@tremor/react';

const DoctorsList = ({ doctors }) => {
  return (
    <div className="space-y-4">
      {doctors.length > 0 ? (
        doctors.map((doctor) => (
          <Card key={doctor.id} className="p-4 bg-gray-800 text-white rounded-lg">
            <Title className="text-lg font-bold">{doctor.name}</Title>
            <Flex flexDirection="column" gap="2" className="mt-4">
              <Text className="text-base">Specialty: {doctor.specialty}</Text>
              <Text className="text-base">Available: {doctor.times.join(', ')}</Text>
              {doctor.emergency && <Text className="text-red-500">Accepts Emergency Consultations</Text>}
              <hr className="my-2 border-gray-500" /> {/* If you prefer to separate each doctor's info */}
            </Flex>
          </Card>
        ))
      ) : (
        <Text className="text-white">No doctors available matching your criteria.</Text> // Ensure consistency in text color
      )}
    </div>
  );
};

export default DoctorsList;
