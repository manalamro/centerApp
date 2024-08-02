import React from 'react';
import CourseList from '../../components/courses/fetchCourses';
import { useAuth } from '../../hooks/useAuth';
import SearchComponent from '../../components/courses/searchCourse'
const Courses = () => {

  const {token } = useAuth();
  
return(
  <>
  <SearchComponent/>
  <CourseList token={token}/>
  </>

)

};

export default Courses;


