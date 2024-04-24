import React from 'react';

export const Modal = (props) => {
    return (
        <>
        <div class="modal">
            <p>Did you complete this task?</p>
            <button onClick={()=> props.dismissModal()}class="btn btn-highlight">Cancel</button>
            <button onClick={()=> props.dismissModal()}class="btn">Confirm</button>
        </div>
        <div onClick={()=> props.dismissModal()}class="backdrop"></div> 
        </>
            
    );
};