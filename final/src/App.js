import axios from "axios";
import React, { useEffect, useState } from "react";
import './App.scss';
import { Link } from "react-router-dom";
import { ThemeContext, themes } from './context/themeContext';
import ReactDOM from "react-dom";



function App() {



  const [columns, setColumns] = useState([])
  const [records, setRecords] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3030/data')
      .then(res => {
        setColumns(Object.keys(res.data[0]))
        setRecords(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      });
  }, [])


  return ReactDOM.createPortal

  return (
    <div className="view-agents">
      <button className="button-82-pushable" role="button">
        <span className="button-82-shadow"></span>
        <span className="button-82-edge"></span>
        <span className="button-82-front text">
          <Link to="/TeamComp">View Current Team</Link>
        </span>
      </button>

      <table>

        <tbody className="row-agent">
          {
            records.map((d, i) => (
              <tr key={i}>
                <td>
                  <img src={d.image} />
                </td>
                <td>
                  <Link to={"Show/" + d.id} className="main-links">{d.name}</Link>
                </td>
                <td>
                <img className="role-image" src={d.roleImage}></img>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default App;
