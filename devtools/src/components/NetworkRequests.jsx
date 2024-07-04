import { useState, useEffect } from 'react';
import axios from 'axios';

const NetworkRequests = () => {

  const [url, setUrl] = useState('');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All'); 
  const [selectedRequest, setSelectedRequest] = useState(null); 

  useEffect(() => {
    const filterRequests = () => {
      if (filter === 'All') {
        setFilteredRequests(requests);
      } 
      else if (filter === 'Img') {
        const filtered = requests.filter(request => {
          return request.request_url.toLowerCase().endsWith('.png') ||
            request.request_url.toLowerCase().endsWith('.jpg');
        });
        setFilteredRequests(filtered);
      } 
      else {
        const filtered = requests.filter((request) => {
          return request.request_url.toLowerCase().includes(filter.toLowerCase());
        });
        setFilteredRequests(filtered);
      }
    };

    filterRequests();
  }, [requests, filter]);

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFilteredRequests([]);
    setLoading(true); 
    try {
      const response = await axios.post('https://testunity-8.onrender.com/capture-requests', { url });
      setRequests(response.data);
      console.log(response.data);
    } 
    catch (error) {
      console.error('Error capturing requests:', error);
    } 
    finally {
      setLoading(false); 
    }
  };

  const handleFilterChange = (filter) => {
    setFilter(filter);
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
  };

  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div>
      <div className='header'>
        <ul className='menu'>
          <li>Elements</li>
          <li>Console</li>
          <li className='active'>Network</li>
          <li>Sources</li>
          <li>Performance</li>
          <li>Memory</li>
          <li>Application</li>
          <li>Lighthouse</li>
        </ul>
        <div className='input'>
          <form onSubmit={handleSubmit}>
            <input type="text" value={url} onChange={handleChange} 
            placeholder="Enter URL" />
            <button type="submit">Submit</button>
          </form>
          <div>
            <button onClick={() => handleFilterChange('All')}>All</button>
            <button onClick={() => handleFilterChange('XHR')}>Fetch / XHR</button>
            <button onClick={() => handleFilterChange('Doc')}>Doc</button>
            <button onClick={() => handleFilterChange('JS')}>JS</button>
            <button onClick={() => handleFilterChange('CSS')}>CSS</button>
            <button onClick={() => handleFilterChange('Font')}>Font</button>
            <button onClick={() => handleFilterChange('Img')}>Img</button>
          </div>
        </div>
      </div>
      <div className='main'>
        {loading ? (
          <p>Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className='initial-message'>
            Recording network activity... <br /> 
            Perform a request or hit <b>Ctrl + R  </b> to record the reload. <br /> <u>Learn more</u>
          </p>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index} onClick={() => openDetailsModal(request)} className="request-row">
                  <td className="url-column">{request.request_url}</td>
                  <td>{request.response_status}</td>
                  <td>{request.response_type}</td>
                  <td>{request.response_size} bytes</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRequest && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeDetailsModal}>&times;</span>
            <h2>Headers</h2>
            <table className="header-table">
              <tbody>
                <tr colSpan="2">
                  <td><h3>General</h3></td>
                </tr>
                <tr>
                  <td>Request URL</td>
                  <td>:  {selectedRequest.request_url}</td>
                </tr>
                <tr>
                  <td>Request Method</td>
                  <td>:  {selectedRequest.request_method}</td>
                </tr>
                <tr>
                  <td>Status Code</td>
                  <td>:  {selectedRequest.response_status}</td>
                </tr>
                <tr>
                  <td>Remote Address</td>
                  <td>:  {selectedRequest.remote_address}</td>
                </tr>
                <tr colSpan="2">
                  <td><h3>Request Headers</h3></td>
                </tr>
                {Object.entries(selectedRequest.requestHeader).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>:  {value}</td>
                  </tr>
                ))}
                <tr colSpan="2">
                  <td><h3>Response Headers</h3></td>
                </tr>
                {Object.entries(selectedRequest.responseHeader).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}:</td>
                    <td>:  {value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export {NetworkRequests}
