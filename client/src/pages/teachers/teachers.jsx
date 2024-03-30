import React from "react";
import TeachersList from '../../components/teachers/teachers'
import TeacherSearch from '../../components/teachers/searchTeacher'
const Teachers = () => {
  return(
   <>
   <TeacherSearch/>
   <TeachersList/>
   </>
  ) ;
};

export default Teachers;
