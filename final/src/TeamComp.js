import {React} from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearTeam, removeFromTeam } from "./features/teamSlice";
import "./App.scss"

function TeamComp() {


  let error = "";
  let duel = 0;
  let ini = 0;
  let cont = 0;
  let senti = 0;

  const team = useSelector((state) => state.team);
  const dispatch = useDispatch();

  const handleRemoveFromTeam = (teamMembers) => {
    dispatch(removeFromTeam(teamMembers));
  }
  const handleClearTeam = () => {
    dispatch(clearTeam());
  }

  for (let i = 0; i < team.teamMembers.length; i++) {
    if (team.teamMembers[i].role == "Duelist") {
      duel += 1;
    }
    if (team.teamMembers[i].role == "Initiator") {
      ini += 1;
    }
    if (team.teamMembers[i].role == "Sentinel") {
      senti += 1;
    }
    if (team.teamMembers[i].role == "Controller") {
      cont += 1;
    }
  }

  if (senti == 0) {
    error += "\nSentinel is Missing."
  }
  if (duel == 0) {
    error += "\nDuelist is Missing."
  }
  if (ini == 0) {
    error += "\nInitiator is Missing."
  }
  if (cont == 0) {
    error += "\nController is Missing."
  }
  console.log(error)
  if (error == "") {
    error = "Team looks good!"
  }


  return (
    <div>
      <h2 className="alt-title">Your Team</h2>
      {team.teamMembers.length === 0 ? (
        <div>
          <p className="red-main">Team is empty!</p>
          <div>
          <Link to="/"><button class="button-82-pushable" role="button">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">
                Return to agent Select
              </span>
            </button></Link>
          </div>
        </div>
      ) : (
        <div>
          <div>
          </div>

          <div>
            <table>
              <thead>
                <td className="table-spacing red-main"></td>
                <td className="table-spacing red-main"><h2>Agent</h2></td>
                <td className="table-spacing red-main"><h2>Role</h2></td>
                <td className="table-spacing red-main"></td>
              </thead>
              <tbody>
                {team.teamMembers?.map(teamMembers => (
                  <tr key={teamMembers.id}>
                    <td className="table-spacing red-main"><img src={teamMembers.image} alt={teamMembers.name} /></td>
                    <td className="table-spacing red-main"><h3>{teamMembers.name}</h3></td>
                    <td className="table-spacing red-main"><p>{teamMembers.role}</p></td>
                    <td className="table-spacing red-main"><button onClick={() => handleRemoveFromTeam(teamMembers)} className="button-82-pushable" role="button">
                      <span className="button-82-shadow"></span>
                      <span className="button-82-edge"></span>
                      <span className="button-82-front text">
                        Remove
                      </span>
                    </button></td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div>
            <div className="role-check">
              <p className="red-main">Duelists: {duel}</p>
              <p className="red-main">Controllers: {cont}</p>
              <p className="red-main">Initiators: {ini}</p>
              <p className="red-main">Sentienels: {senti}</p>
            </div>
            <div className="red-main error-msg">
              {error}
            </div>
            <button  onClick={() => handleClearTeam()} className="button-82-pushable" role="button">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">
                Clear Team
              </span>
            </button>
          </div>



          <Link to="/"><button className="button-82-pushable" role="button">
              <span className="button-82-shadow"></span>
              <span className="button-82-edge"></span>
              <span className="button-82-front text">
                Return to agent Select
              </span>
            </button></Link>
        </div>
      )}
    </div>
  );
}

export default TeamComp;