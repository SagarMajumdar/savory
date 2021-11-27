import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { callservermethod } from './axioshook';
import {List} from './List'
import savory from './assets/savory.png';
import axios  from 'axios';
const ListsLi = (props) => {
    const [lists , setLists ] = useState([]);
    const [newList, setNewList] = useState('');
    const [curLi , setcurLi] = useState(null);

    const history = useHistory();
    
    useEffect(()=>{
        getListsFromDb();
    },[])

    const genpdf = async (listname) => {

        const result =  await callservermethod('http://localhost:5000/savory/api/genpdf',  {listname:listname});
       
          if(result.msg === 'ok') {
          }
          else if( result.status === 401) {
               history.push('/savory/login');
          }


    }
    const getListsFromDb = async ()=>{
       const result =  await callservermethod('http://localhost:5000/savory/api/getlists', {});
      
       if(result.msg === 'ok') {
            if (result.data.length > 0) {
                setLists(result.data[0].lists);
            }
       }
       else if( result.status === 401) {
            history.push('/savory/login');
       }
    }

    const handleAddList = async  ()=>{
        
        const result = await callservermethod('http://localhost:5000/savory/api/addlist', {newList: newList});
        if(result.status === 201) {
            getListsFromDb();
        }
        else if( result.status === 401) {
            history.push('/savory/login');
        }
        else if(result.status === 409 || result.status === 500) {
            console.log(result.msg);
        }
    }

 

    return (
        <>  
                <div className="columns">
                    <div className="column is-2"></div>
                    <div className="column is-8">
                        <div className="columns ">
                            <div className="column is-3"><img src={savory} alt="savory"></img></div>
                            <div className="column is-5">
                            </div>
                            <div className="column is-4">
                                <div className="v-centered" style={{marginTop:'10px'}}>
                                <span> hello {props.fname} </span>
                                <button  type="button" className="button is-small is-outlined is-danger" onClick={
                                    ()=>{
                                        localStorage.removeItem('savory_access_token')
                                        history.push('/savory/login');
                                    }
                                } >logout</button>
                                </div>
                            </div>
                        </div>        
                    </div>
                    <div className="column is-2"></div>
                </div>
                <div className="columns">
                    <div className="column is-2">
                    </div>
                    <div className="column is-3">
                        <h3 className="title is-3">Lists</h3>
                        <p> type a new list name and click on the add list button.</p>
                        <div>
                            <input className="input is-small" type="text " value={newList} onChange={(e)=>{  setNewList(e.target.value) }}/>
                            <button style= {{marginTop:'2px',marginBottom:'5px'}} className="button is-small is-dark is-rounded" type="button" onClick={handleAddList} disabled = { newList === ''}>add list</button>
                        </div>
                        <ul>
                            {lists.length> 0 &&  
                                lists.map((li, i) => {
                                    return ( 
                                        <li key={i}> 
                                            <div
                                            style={ curLi != null && curLi.listname === li.listname  ? 
                                                    { cursor:'pointer', marginTop:'10px', backgroundColor: '#4caf50', padding: '10px', borderRadius: '10px'}
                                                    : {cursor: 'pointer',marginTop:'10px', padding: '10px', borderRadius: '10px'} }
                                                    onClick= {  () => { setcurLi( li) } }  >
                                                <h6 style={ curLi != null && curLi.listname === li.listname  ?  { color: 'white'} : null } className="title is-6">{li.listname}</h6>
                                                <button style={{marginBottom: '10px'}} type="button" className="button is-warning is-small  is-rounded" onClick={()=>{ genpdf( li.listname ) }}>download list</button>
                                                <p style={ curLi != null && curLi.listname === li.listname  ?  { color: 'white'} : { color: '#a6a6a6' } } className="is-small content">
                                                {li.liabout}
                                                </p>
                                            </div> 
                                        </li>
                                    )
                                }) 
                            }
                        </ul>
                    </div>
                    <div className="column is-5" style={{backgroundColor:'rgb(232 232 232)', borderTopLeftRadius:'5px',borderTopRightRadius:'5px'}}>
                        {
                        curLi != null &&
                            <>
                            {/* <p>{curLi.listname}</p> */}
                            <List getListsFromDb={getListsFromDb} li={curLi}></List> 
                            </>
                        } 
                    </div>
                    <div className="column is-2">
                    </div>
                </div>
                
                
            
                    
        </>
    );
}

export default ListsLi;