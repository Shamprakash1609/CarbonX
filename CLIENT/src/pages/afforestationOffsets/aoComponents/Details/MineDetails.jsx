import React from 'react';

const MineDetails = ({ mine }) => {
  if (!mine) return null;

  return (
    <div className="mine-details-container bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{mine["Mine Name"]}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-600">Type of Mine</p>
          <p className="text-gray-800">{mine.TypeofMine}</p>
        </div>
        
        <div>
          <p className="font-semibold text-gray-600">Location</p>
          <p className="text-gray-800">
            Lat: {mine.Latitude}, Lng: {mine.Longitude}
          </p>
        </div>
        
        {/* Add more details as needed */}
        {Object.entries(mine)
          .filter(([key]) => !['Mine Name', 'TypeofMine', 'Latitude', 'Longitude'].includes(key))
          .map(([key, value]) => (
            <div key={key}>
              <p className="font-semibold text-gray-600">{key}</p>
              <p className="text-gray-800">{value}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MineDetails;