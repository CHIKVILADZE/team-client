import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TableComponent({ users }) {
  const formatNumber = (number) => {
    return number.match(/.{1,2}/g).join('-');
  };

  return (
    <div className="container">
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Email</th>
            <th scope="col">Number</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.email}</td>
              <td>{formatNumber(user.number)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableComponent;
