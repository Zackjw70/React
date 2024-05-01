import axios from "axios";
import React, {useEffect, useState} from "react";
import './App.css';
import {Link} from "react-router-dom";
import {useParams} from "react-router-dom";

function Show(){
    const {idNum} = useParams();
    const idNumNumber = Number(idNum);
    const [itemNum, setItemNum] = useState(idNumNumber);
    const [record, setRecord] = useState([]);

    let axiosVar = 'http://localhost:3030/products/' + itemNum;
    useEffect(()=>{
        axios.get('http://localhost:3030/products/' + itemNum)
        .then(res=>{
            console.log(res.data)
            setRecord(res.data)
            
        })
        .catch((err)=>{
            console.log(err)
        });
    }, [])





    return(
        <div>
            <img src={record.image} className="imgTwo"/>
            <p>Name: {record.title}</p>
            <p>Description: {record.description}</p>
            <p>Category: {record.category}</p>
            <p>Price: {record.price}</p>
            
            
            
            <Link to="/"><button>Return</button></Link>
        </div>
        
    )
}export default Show;