import axios from "axios";
import React, {useEffect, useState} from "react";
import './App.scss';
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToTeam } from "./features/teamSlice";


function Show(){
    const {idNum} = useParams();
    const idNumNumber = String(idNum);
    const [itemNum, setItemNum] = useState(idNumNumber);
    const [record, setRecord] = useState([]);
    const [role, setRole] = useState([])

    
    let axiosVar = 'http://localhost:3030/data/' + itemNum;
    useEffect(()=>{
        axios.get('http://localhost:3030/data/' + itemNum)
        .then(res=>{
            console.log(res.data)
            setRecord(res.data)         
        })
        .catch((err)=>{
            console.log(err)
        });
    }, [])

    const dispatch = useDispatch();


    const handleAddToTeam = (record) =>{
        dispatch(addToTeam(record))

    }





    return(
        <div>
           <img src={record.image} className="imgTwo"/>
           <p className="red-main"><b>Agent Name:</b> {record.name}</p>
            <p className="desc-agent red-main"><b>Description:</b> {record.desc}</p>
            <p className="red-main"><b>Role:</b> {record.role}</p><img className="role-image" src={record.roleImage}></img>
            <button onClick= {() => handleAddToTeam(record)} className="button-82-pushable" role="button">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">
                <Link to="/teamComp">Add to Team</Link>
              </span>
            </button>
            {/* <Link to={"/TeamComp/"+record.id}><button>Add to Team</button></Link> */}
            <button className="button-82-pushable" role="button">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">
                <Link to="/">Return</Link>
              </span>
            </button>
        </div>
        
    )
}export default Show;