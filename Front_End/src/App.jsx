import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const recordsPerPage = 20;

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:3000/customers")
      .then((res) => res.json())
      .then((result) => setData(result.rows))
      .catch((err) => console.error(err));
  }, []);

  // Handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredData = data.filter(
    (row) =>
      row.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort data based on column and direction
  const sortedData = filteredData.slice().sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (sortDirection === "asc") {
        return sortColumn === "sno" || sortColumn === "age"
          ? aValue - bValue
          : aValue.localeCompare(bValue);
      } else {
        return sortColumn === "sno" || sortColumn === "age"
          ? bValue - aValue
          : bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / recordsPerPage);

  // Get current page data
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
   return (
    <>
      <div className="header">
        <h2>Customers</h2>
        <input
          className="search"
          type="text"
          placeholder="Search by Name or Location"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="sort-dropdown dropdown">
        <label htmlFor="sort-select" id="label">
          Sort by:
        </label>
        <select
          id="sort-select"
          onChange={(e) => handleSort(e.target.value)}
          value={sortColumn}
        >
          <option value="">Select column</option>
          <option value="sno">Sno</option>
          <option value="customer_name">Customer Name</option>
          <option value="age">Age</option>
          <option value="phone">Phone</option>
          <option value="location">Location</option>
          <option value="created_at">Date or Time</option>
        </select>
        <select
          id="sort-select-2"
          onChange={(e) => setSortDirection(e.target.value)}
          value={sortDirection}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <table className="table mytable">
        <thead className="table-dark ">
          <tr className="tablerow">
            <th id="th1">Sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Date</th>
            <th id="th2">Time</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((row) => (
            <tr key={row.sno}>
              <td >{row.sno}</td>
              <td>{row.customer_name}</td>
              <td>{row.age}</td>
              <td>{row.phone}</td>
              <td>{row.location}</td>
              <td>{row.created_at.slice(0, 10)}</td>
              <td>{row.created_at.slice(11, 19)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination buttons">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="footer"></div>
    </>
  );
}

export default App;


 