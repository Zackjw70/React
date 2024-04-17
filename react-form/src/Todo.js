import { SignUpForm } from './form';
import {useState} from 'react';

const Todo = () => {
    const [showModal, setShowModal] = useState(false);
    const onDissmissModal = () => {
        setShowModal(false)
    }

    return(
        <>
        <div class="card">
        <div class="card-content">
          <h2>Form</h2>
          <button onClick={() => setShowModal(true)}class="btn">Start</button>
        </div>
      </div>
      { showModal && <SignUpForm dismissModal={onDissmissModal}/>}
        </>
        
    )
}

export default Todo