import { useHistory } from "react-router-dom";

function CompleteProfile() {
  const history = useHistory();

  const handleClick = () => {
    history.push("/complete-profile");
  };

  return <button onClick={handleClick}>Complete Profile</button>;
}

export default CompleteProfile;
