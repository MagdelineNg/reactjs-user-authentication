import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const authCtx = useContext(AuthContext)
  const history = useHistory()
  const newPwInputRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredNewPassword = newPwInputRef.current.value;

    try{
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCqaZwPSdk7WwFgvOgH5wwXDUYkMQoZlZo",
        {
          method: 'POST',
          body: JSON.stringify({   //convert js obj/array into json string
            idToken: authCtx.token,
            password: enteredNewPassword,
            returnSecureToken: false
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
  
      const data = await response.json()  //parses json response to js obj
  
      if (!response.ok){
        throw new Error(data.error.message)
      }

      history.replace('/')
    }catch(error){
      alert(error)
    }

  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPwInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
