import React, { useEffect, useState } from "react";
import { callservermethod } from "./axioshook";
import { useHistory } from "react-router";
const LiAbout = ({li,getListsFromDb})=>{
    const history = useHistory();

    const [txtLiAbout, setTxtLiAbout] = useState('');
    
    useEffect(()=>{
        setTxtLiAbout(li.liabout);
    },[li])

    const handleLiaboutAddUpdt =async () => {
        const result =  await callservermethod('http://localhost:5000/savory/api/addupdtliabout', {txtLiAbout:txtLiAbout, listname: li.listname});
        
        if(result.status == 200) {
          
            getListsFromDb();
        }
        if( result.status === 401) {
            history.push('/savory/login');
       }
       else if(result.status === 500) {
            console.log(result.msg);
       }
    }

    return (
        <>  
            <textarea className="textarea is-small" rows="7" value={txtLiAbout} onChange={(e) => {  setTxtLiAbout(e.target.value) }} ></textarea>
            <button className="button is-small is-rounded is-outlined is-dark " style={{marginTop:'5px', marginBottom:'10px'}} type="button" onClick={handleLiaboutAddUpdt} disabled={  txtLiAbout === ''} >  
                { li.liabout === '' ? 'add about' : 'update about'}
            </button>
        </>
    );
}

export default LiAbout;