import "./App.css";
import { Route } from "react-router-dom";
import { useContext } from "react";
import SignUp from "./auth/SignUp";
import AuthContext from "./store/AuthContext";
// import Layout from "./Layout/Layout";

function App() {
  const authCtx = useContext(AuthContext);
  // return (
  //   <Layout>
  //     {!authCtx.isLoggedIn && (
  //       <Route path="/">
  //         <SignUp />
  //       </Route>
  //     )}
  //   </Layout>
  // );
  return <SignUp />;
}

export default App;
