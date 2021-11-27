import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { callservermethod } from './axioshook';
import ListsLi from './ListsLi';
const Main  = () => {
    const history = useHistory();
    const [curruserfname, setcurruserfname] = useState('');

    const verifyToken = async()=>{
        const result = await callservermethod('http://localhost:5000/savory/api/verifytoken',{});
        if (!result.status === 200)  { history.push('/savory/login'); }
        else { 
            const jwttoken =  localStorage.getItem('savory_access_token');
            var {fname} =JSON.parse( Buffer.from(jwttoken.split('.')[1] , 'base64') );
            setcurruserfname(fname);
        }   
    }

    useEffect( ()=>{
          verifyToken();
    }, []);

   

    return (
        <>
            <ListsLi fname = {curruserfname} ></ListsLi>
            
        </>
    )
}
export default Main;