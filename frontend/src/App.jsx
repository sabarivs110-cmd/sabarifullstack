import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    fetch("/api/employees")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to connect to backend API");
      });

  }, []);


  return (

    <div className="container">

      <h1>Employee Management System</h1>


      {error && (
        <p className="error">
          {error}
        </p>
      )}


      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>


        <tbody>

          {
            employees.map((employee) => (

              <tr key={employee.id}>

                <td>{employee.id}</td>

                <td>{employee.name}</td>

                <td>{employee.email}</td>

                <td>{employee.department}</td>

              </tr>

            ))
          }

        </tbody>

      </table>


    </div>

  );
}


export default App;
