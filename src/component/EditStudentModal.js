import React, { useState } from "react";
import "../assest/editModal.css";
import axios from "axios";

const EditStudentModal = (props) => {
  const { setShowEditModal, selectedStudent, students, setDidUpdate, didUpdate} = props;
  const [stdNumber, setStdNumber] = useState(selectedStudent.studentNumber);
  const [name, setName] = useState(selectedStudent.name);
  const [lastName, setLastName] = useState(selectedStudent.lastName);
  const [stdClass, setStdClass] = useState(selectedStudent.stdClass);

  const handleEdit = (event) => {
    event.preventDefault();

    if (stdNumber === "" || name === "" || lastName === "" || stdClass === "") {
      alert("All information must be filled");
      return;
    }

    const filteredStudents = students.filter(item => item.id !== selectedStudent.id)

    const hasStudent = filteredStudents.find((item)=>item.studentNumber === stdNumber)
    if (hasStudent !== undefined){
        alert("This student number already exists!")
        return
    } 

    const updatedStudent = {
      ...selectedStudent,
      studentNumber: stdNumber,
      name: name,
      lastName: lastName,
      stdClass: stdClass,
    };
    
    axios.put (`http://localhost:3004/students/${selectedStudent.id}`,updatedStudent)
    .then((result) => {
        setShowEditModal(false)
        setDidUpdate(!didUpdate)
    }).catch((err) => {
        console.log(err)
    });
  };

  return (
    <div className="modalMainContainer">
      <div className="modalContainer">
        <h1 className="modelTitle">Edit Student</h1>

        <form onSubmit={handleEdit} className="w-75 mx-auto">
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
              value={stdClass}
              onChange={(event) => setStdClass(event.target.value)}
              type="text"
              className="form-control"
              id="stdClass"
            />
          </div>

          {/* savebutton */}
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-outline-primary">
              Save
            </button>

            <button
              className="btn btn-outline-danger mx-3"
              onClick={() => {
                setShowEditModal(false);
              }}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
