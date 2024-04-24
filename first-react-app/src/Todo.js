import { Modal } from './Modal';
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
          <h2>Learn React</h2>
          <button onClick={() => setShowModal(true)}class="btn">Done</button>
        </div>
      </div>
      { showModal && <Modal dismissModal={onDissmissModal}/>}
        </>
        
    )
}

export default Todo