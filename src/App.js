import React, { useEffect, useState } from "react";
import axios from "axios";
import EditStudentModal from "./component/EditStudentModal";

function App() {
  const [searchText, setSearchText] = useState("");
  const [students, setStudents] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stdNumber, setStdNumber] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [stdClass, setStdClass] = useState("");
  const [didUpdate, setDidUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({
    id: "",
    studentNumber: "",
    name: "",
    lastName: "",
    stdClass: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3004/students")

      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [didUpdate]);


  const handleAdd = (event) => {
    event.preventDefault();

    if (stdNumber === "" || name === "" || lastName === "" || stdClass === "") {
      alert("All information must be filled");
      return;
    }

    const hasStudent = students.find(
      (item) => item.studentNumber === stdNumber
    );
    if (hasStudent !== undefined) {
      alert("This student number already exists!");
      return;
    }

    const newStudent = {
      id: String(new Date().getTime()),
      studentNumber: stdNumber,
      name: name,
      lastName: lastName,
      stdClass: stdClass,
    };

    axios
      .post("http://localhost:3004/students", newStudent)
      .then((result) => {
        setStudents([...students, newStudent]);
        setShowAddForm(false);
        setStdNumber("");
        setName("");
        setLastName("");
        setStdClass("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* DELETE  */
  const handledelete = (studentId) => {
    axios
      .delete(`http://localhost:3004/students/${studentId}`)
      .then((result) => {
        setDidUpdate(!didUpdate);
        /* I want to use DIDUPDATE 
       const filteredStudents = students.filter(item => item.id !== studentId)
      setStudents(filteredStudents) 
      */
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //early escape
  if (students === null) {
    return <h1>Loading...</h1>;
  }

  var filteredStudents = [];
   filteredStudents = students.filter((item) => {
    if (
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.lastName.toLowerCase().includes(searchText.toLowerCase())
    )
    return true
  });


  return (
    <div>
      <nav className="navbar navbar-light bg-primary navbar-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Crud App
          </a>
        </div>
      </nav>

      <div className="container my-5">
        <div className="d-flex justify-content-between">
          <input
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
            type="text"
            className="form-control w-75"
            placeholder="Type to search..."
          />
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
            }}
            className="btn btn-primary"
          >
            Add Student
          </button>
        </div>

        {showAddForm === true && (
          <form onSubmit={handleAdd} className="w-50 mx-auto">
            <div className="mb-3">
              <label htmlFor="stdNumber" className="form-label">
                Student Number
              </label>
              <input
                value={stdNumber}
                onChange={(event) => setStdNumber(event.target.value)}
                type="text"
                className="form-control"
                id="stdNumber"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                className="form-control"
                id="name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                type="text"
                className="form-control"
                id="lastName"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stdClass" className="form-label">
                Class
              </label>
              <input
                type="text"
                className="form-control"
                id="stdClass"
                value={stdClass}
                onChange={(event) => setStdClass(event.target.value)}
              />
            </div>

            {/* savebutton */}
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-outline-primary">
                Save
              </button>
            </div>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th scope="col">StudentNo</th>
              <th scope="col">Name</th>
              <th scope="col">LastName</th>
              <th scope="col">Class</th>
              <th>Process</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.studentNumber}</td>
                <td>{student.name}</td>
                <td>{student.lastName}</td>
                <td>{student.stdClass}</td>
                <td>
                  <button
                    onClick={() => {
                      handledelete(student.id);
                    }}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setSelectedStudent(student);
                    }}
                    className="btn btn-sm btn-warning mx-1"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <EditStudentModal
          didUpdate={didUpdate}
          setDidUpdate={setDidUpdate}
          students={students}
          selectedStudent={selectedStudent}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}

export default App;
