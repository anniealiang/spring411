import axios from "axios";
const url = 'http://localhost:3001/user'

export const addToUser = async (uid, email, name) => {
        
    const payload = {
        uid,
        email, 
        name,
    }
    try {
        //console.log(payload)
        const res = await axios.post(url, payload)
        //console.log(res);
        return res.data;
    } catch (e) {
        console.log(e)
    }
    
    
}