import React from 'react';
import { SignUpForm } from './form';

export const Modal = (props) => {
    return (
        <>
        <div class="modal">
            <p>Form</p>
            <SignUpForm />
            <button onClick={()=> props.dismissModal()}class="btn btn-highlight">Cancel</button>
            <button onClick={()=> props.dismissModal()}class="btn">Confirm</button>
        </div>
        <div onClick={()=> props.dismissModal()}class="backdrop"></div> 
        </>
            
    );
};