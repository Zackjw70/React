import {useEffect, useState} from "react";
import axios from "axios";

const baseURL = 'http://localhost:3000/';


const usePost = (userId, title, body, url) => {
    console.log(userId, title, body, url);
    console.log("usePost");

    const [loading, setLoading] = useState(true);
    var formdata = new FormData();
    //add three variable to form
    formdata.append("userId", userId);
    formdata.append("title", title);
    formdata.append("body", body);

    const [data, setData] = useState();
    useEffect((formdata) => {
        

        const setjSON = async () => {
            try{
                const response = await axios.post(`${baseURL}${url},${formdata}`);
                setData(response.data)
            }
            catch (error){
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        };
        setjSON();

    });
    return {data}
};
export default usePost;