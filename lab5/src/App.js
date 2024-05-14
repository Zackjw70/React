import axios from "axios";
import React, { useEffect, useState} from "react";
import './App.css';
import { Link } from "react-router-dom";



function App() {
  const [columns, setColumns] = useState([])
  const [records, setRecords] = useState([])

  
  useEffect(()=> {
    axios.get('http://localhost:3030/products')
    .then(res=>{
      setColumns(Object.keys(res.data[0]))
      setRecords(res.data)
      console.log(res.data)
  })
  .catch((err)=>{
    console.log(err)
  });
  }, [])

  return (
    
    <div>
      <table>
        <tbody>
        {
          records.map((d,i) => (
              <tr key={i}>
                  <td>
                      <img src={d.image}/>
                  </td>
                  <td>
                      <Link to={"Show/"+d.id} >{d.title}</Link>
                  </td>
              </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  );
}

export default App;
