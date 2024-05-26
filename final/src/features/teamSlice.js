import {createSlice} from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    teamMembers: localStorage.getItem("teamMembers") 
    ? JSON.parse(localStorage.getItem("teamMembers")) 
    : [],
    teamTotal: 0,

};

const teamSlice = createSlice({
    name: "team",
    initialState,
    reducers:{
        addToTeam(state, action){
            const agentIndex = state.teamMembers.findIndex((record) => record.id === action.payload.id);
            if(agentIndex >= 0){
                state.teamMembers[agentIndex].teamTotal += 1; {/* Might cause an issue */};
                toast.error("Already in Team!", {
                    position: "bottom-right",
                });
            }else{
                const tempAgent = { ...action.payload, teamQuantity: 1 };
                state.teamMembers.push(tempAgent);
                toast.success("Added to Team!", {
                    position: "bottom-right",
                });

            }

            localStorage.setItem("teamMembers", JSON.stringify(state.teamMembers))

            console.log(state.teamMembers)


            
        },
        removeFromTeam(state, action){
            const nextTeamMembers = state.teamMembers.filter(
                teamMembers => teamMembers.id !== action.payload.id
            )

            state.teamMembers = nextTeamMembers
            localStorage.setItem("teamMembers", JSON.stringify(state.teamMembers))

            toast.info("Removed from Team!", {
                position: "bottom-right",
            });
        },
        clearTeam(state, action){
            state.teamMembers = [];

            localStorage.setItem("teamMembers", JSON.stringify(state.teamMembers))

            toast.info("Cleared Team!", {
                position: "bottom-right",
            });
        }
    },
});
export const { addToTeam, removeFromTeam, clearTeam } = teamSlice.actions;
export default teamSlice.reducer;