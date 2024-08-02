import Error  from "../../pages/notFound";
import Login from "../../pages/login/login";

const ManagerAuth = ({ children }) => {
    const userRole=localStorage.getItem("role")
    console.log(userRole)
    if (userRole === "manager") {
      return <>{children}</>;
    } else {
      return<Error/>
     
    }
  };

  export default ManagerAuth;