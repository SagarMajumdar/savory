
import React, { useEffect, useState } from "react";
import { callservermethod } from "./axioshook";
import { useHistory } from "react-router";

const LiStatus =  ({indx, li,setliitStatusChanged}) => {
    const [rld,setrld] = useState(false);

    const history= useHistory();
 
    const toggleLiStatus =async ()=>{
        const result =  await callservermethod('http://localhost:5000/savory/api/togglestatus', {indx:indx, listname: li.listname, updtstatus:  ( li.liitems[indx].status == 'incomplete'? 'complete' : 'incomplete')});
        
        if(result.status == 200) {
            li.liitems[indx].status = (  li.liitems[indx].status == 'incomplete' )? 'complete' : 'incomplete';
            setrld((p)=> { return !p; })
            setliitStatusChanged((p) => { return !p;})
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
            <div  style={ li.liitems[indx].status == 'incomplete' ?  
                {marginRight:'3px', display:'inline-block', width:'15px', height:'15px', borderRadius:'8px', backgroundColor:'rgb(126 214 130)'}
                : {marginRight:'3px', display:'inline-block', width:'15px', height:'15px', borderRadius:'8px', backgroundColor:'#bdbdbd'} }
                onClick={toggleLiStatus}>
  
            </div>
        </>
    );
}

export default LiStatus;