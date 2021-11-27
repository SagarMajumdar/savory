import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { callservermethod } from "./axioshook";
import LiStatus from './LiStatus';

const LiItems = ({li})=>{
    const [newLiItem, setNewLiItem] = useState('');
    const [liitStatusChanged, setliitStatusChanged] = useState(false);
    const history= useHistory();

    // us
    const addNewLiItem =async ()=>{
        const result =  await callservermethod ('http://localhost:5000/savory/api/addnewliitem', 
            {newLiItem:newLiItem, listname: li.listname});
        
        if(result.status == 200) {
            li.liitems.push({title:newLiItem, status: 'incomplete'})
            setNewLiItem('');  
        }
        if( result.status === 401) {
            history.push('/savory/login');
       }
       else if(result.status === 500) {
            console.log(result.msg);
       }
    }

    return (
        <div>
            <div className="columns">
                <div className="column is-11">
                    <input  className="input is-small" type="text" value={newLiItem} onChange={(e)=>{ setNewLiItem(e.target.value) }}></input>
                </div>
                <div className="column">
                    <button type="button" className="button is-dark is-small" onClick={ addNewLiItem} disabled={newLiItem === ''} >+</button>
                </div>
            </div>

            <ul className="content">
                {
                    li.liitems.map((itm,i) =>{
                        return (
                            <li key = {i}>
                                <LiStatus indx={i} li={li} setliitStatusChanged={setliitStatusChanged} ></LiStatus>
                                <span style={ itm.status == 'complete' ?  
                                    {color: 'rgb(189, 189, 189)', fontSize: 'x-small'}
                                    : null }> 
                                    {itm.title}</span> 
                                </li>
                                    
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default LiItems;