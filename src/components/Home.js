import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeo, fetchHistory, createHistoryEntry } from '../redux/geoSlice';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const [ip, setIp] = useState('');
  const [selectedHistory, setSelectedHistory] = useState([]); // State to store selected items
  const [error, setError] = useState(''); // State for validation error message
  const currentGeo = useSelector((state) => state.geo.currentGeo);
  const history = useSelector((state) => state.geo.history);

  useEffect(() => {
    const fetchCurrentIP = async () => {
      try {
        const response = await axios.get('https://ipapi.co/ip/');
        const userIp = response.data;
        setIp(userIp); // Set the current IP to state
        dispatch(fetchGeo(userIp)); // Fetch geo data for the current IP
      } catch (error) {
        console.error('Error fetching current IP:', error);
      }
    };

    fetchCurrentIP(); // Call the function to fetch the current IP
    dispatch(fetchHistory()); // Fetch history regardless of the IP
  }, [dispatch]);

  // Regular expression for validating IPv4 addresses
  const isValidIP = (ip) => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip);
  };

  const handleSearch = () => {
    if (isValidIP(ip)) {
      setError(''); // Clear error if IP is valid
      dispatch(fetchGeo(ip)); // Fetch geolocation for the entered IP
      dispatch(createHistoryEntry(ip)); // Create a new history entry for the valid IP
    } else {
      setError('Please enter a valid IP address'); // Set error if IP is invalid
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (id) => {
    setSelectedHistory((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((itemId) => itemId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  // Handle the delete action for selected history items
  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:8000/api/history', { data: { ids: selectedHistory } });
      dispatch(fetchHistory()); // Fetch the updated history after deletion
      setSelectedHistory([]); // Clear the selected items
    } catch (error) {
      console.error('Error deleting selected history:', error);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="form-group">
        <label>Enter IP Address:</label>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`} // Add Bootstrap's error class
          placeholder="Enter IP address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSearch}>
          Search
        </button>
        {error && <div className="invalid-feedback">{error}</div>} {/* Error message */}
      </div>

      {currentGeo && (
        <div className="mt-5">
          <h4>Geolocation Information</h4>
          <p>IP: {currentGeo.ip}</p>
          <p>Location: {currentGeo.city}, {currentGeo.region}, {currentGeo.country}</p>
        </div>
      )}

      <div className="mt-5">
        <h4>History</h4>
        <ul className="list-group">
          {history.map((item) => (
            <li key={item.id} className="list-group-item">
              <input
                type="checkbox"
                checked={selectedHistory.includes(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
              <span className="ms-2">
                {item.ip} - {item.city} {item.region}, {item.country}
              </span>
            </li>
          ))}
        </ul>
        <button
          className="btn btn-danger mt-3"
          onClick={handleDelete}
          disabled={selectedHistory.length === 0} // Disable if no items are selected
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
};

export default Home;
