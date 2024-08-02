import Error  from "../../pages/notFound";

const AdminAuth = ({ children }) => {
    const userRole=localStorage.getItem("role")
    console.log(userRole)
    if (userRole === "admin") {
      return <>{children}</>;
    } else {
      return<Error/>
     
    }
  };

  export default AdminAuth;