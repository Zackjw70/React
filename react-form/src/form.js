import React, { useState } from 'react';

export const SignUpForm = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
      setEmail(e.target.value);
      

  };
  const handlefNameChange = (e) => {
    if (e.target.value !== " "){
      setFirstName(e.target.value)
      document.querySelector(`#fNameError`).innerHTML = ""
      
    }
    else{
      document.querySelector(`#fNameError`).innerHTML = "First Name must not be blank."
    }
    
    
    
  };
  const submitForm = () => {
    const enteredEmail = document.querySelector('#emailInp').value
    const regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let error = 0;
    const regxAnswer = regx.test(enteredEmail)
    if (regxAnswer === true){
      document.querySelector(`#emailError`).innerHTML = ""
    }
    else{
      document.querySelector(`#emailError`).innerHTML = "Must be a valid email"
      error ++
    }
    const lName = document.querySelector(`#lNameInp`).value
    if (lName.length > 2){
      document.querySelector(`#lNameError`).innerHTML = ""
    }
    else{
      document.querySelector(`#lNameError`).innerHTML = "Last Name must be longer then two characters"
      error++
    }
    if (error === 0){
      setFirstName(''); 
      setLastName(''); 
      setEmail(''); 
      props.dismissModal();
    }
    else{

    }


     
  }

  const clearForm = () => { 
     setFirstName(''); 
     setLastName(''); 
     setEmail(''); 
  };

  return (
    <div className="container">
      <div>
        <label className="form-label">First Name</label>
        <input
            type="text"
            value={firstName}
            onChange={handlefNameChange}
        />
        <p id="fNameError">

        </p>
      </div>
      <div>
        <label className="form-label">Last Name</label>
        <input
            id="lNameInp"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
        />
        <p id="lNameError">

        </p>
      </div>
      <div>
        <label className="form-label">Email</label>
        <input id="emailInp" type="text" value={email} onChange={handleEmailChange} />
        <p id="emailError">

        </p>
      </div>
      
      
      
      <button onClick={clearForm} className="button">
          Clear
      </button>
      <button onClick={submitForm}>
          Submit
      </button>
      
    </div>
  );
};