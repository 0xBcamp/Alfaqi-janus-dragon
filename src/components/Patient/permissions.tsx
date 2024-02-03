import React from 'react';

const Permissions = ({ permissions }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Permissions</h2>
      <ul>
        {permissions.map((permission, index) => (
          <li key={index} className="mt-2">
            <p>{permission}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Permissions;
