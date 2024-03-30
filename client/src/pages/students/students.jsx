import React from "react";
import { useAuth } from "../../hooks/useAuth";
import StudentList from "../../components/students/studentsList";
import StudentSearch from "../../components/students/searchStudent";
const Students = () => {
  const { token } = useAuth();

  return (
    <>
      <StudentSearch />
      <StudentList token={token} />
    </>
  );
};

export default Students;
