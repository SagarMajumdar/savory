import  React, { useReducer, useState } from 'react';
import { useHistory } from 'react-router';
import savory from './assets/savory.png';
import { callservermethod } from './axioshook';
const Login = () => {

    const history = useHistory();
    const [err, setErr] = useState('');
    const initloginstate = {
        email: '', 
        password: ''
    }   
    
    function reducerfn (state, action) {
        switch(action.act) {
            case 'handlechange_email':
                return {...state, email:  action.v }
            case 'handlechange_pwd':
                return {...state, password:  action.v }
            case 'reset_loginfields':
                return {...initloginstate}
            default:
                break;
        }
    }

    const [loginState, dispatchfn] = useReducer (
        reducerfn, 
        initloginstate
    )

    const handleloginsubmit =async (e) => {
        e.preventDefault();
        
        const { status, data, msg} = await callservermethod('http://localhost:5000/savory/api/login', 
        { email: loginState.email, password: loginState.password});
    
        if ( status  == 200 ) 
        {
            localStorage.setItem('savory_access_token', data.savorytoken);
            history.push('/savory/main');
        }    
        else if(status == 401) {
            setErr(msg);        
        }
        else if (status == 500) {
            setErr(msg);
        }
    }

    return (
        <>
            {/* <img src={savory}></img> */}
            <div className="columns is-vcentered">
                    <div className="column is-3">
                    </div>
                    <div className="column is-2">
                        <img src={savory}></img>
                    </div>
                    <div className="column"><h4 className="title is-4" style={{color:'#5b6e8c'}}>savory</h4></div>
                </div>
            <form onSubmit={handleloginsubmit}>
                <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="login_txt_email" >email</label>
                    </div>
                    <div className="column is-2">
                        <input className="input is-small" value={loginState.email} onChange={ (e)=> { dispatchfn({act:'handlechange_email' , v: e.target.value}) } } type="text" id="login_txt_email"></input>
                    </div>
                    <div className="column"></div>
                </div>
                <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="login_pwd">password</label>
                    </div>
                    <div className="column is-2">
                        <input className="input is-small" value={loginState.password}   onChange={ (e)=> { dispatchfn({act:'handlechange_pwd' , v: e.target.value}) } }    type="text" id="login_pwd"></input>               
                    </div>
                    <div className="column"></div>
                </div>
                <div className="columns">
                    <div className="column is-3"> </div>
                    <div className="column is-2">
                        <button className="button is-small" style={{marginRight:'3px'}}  type="submit" >login</button> 
                        <button className="button is-small" style={{marginRight:'3px'}} type="button" onClick={ ()=>{ dispatchfn({act:'reset_loginfields' })} } >clear</button>
                        <button className="button is-small" style={{marginRight:'3px'}} type="button" onClick={()=>{ history.push('/savory/signup') }}>sign up</button>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-3"> </div>
                    <div className="column is-2"> 
                        <div className="content is-small">Icons made by <a href="https://www.flaticon.com/authors/icongeek26" title="Icongeek26">Icongeek26</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                    </div>
                </div>
                
                
                
                
               
            </form>
        </>
    );
}

const Signup= ()=> {
    const history=useHistory();

    const [err, setErr] = useState('');

    const initsignupstate = {email: '', password: '', fname: '', lname: '', password_confirm:''};
    const reducerfn = (state,action) => {
        switch(action.act) {
            case 'handle_change_fname':
                return {...state, fname: action.valu}
            case 'handle_change_lname':
                return {...state, lname: action.valu}
            case 'handle_change_email':
                return {...state, email: action.valu}
            case 'handle_change_password':
                return {...state, password: action.valu}
           case 'handle_change_password_confirm':
                return {...state, password_confirm: action.valu}
            default:
                break;
        }            
    }
    const [signupstate, dispatchfn ] =  useReducer(reducerfn, initsignupstate); 
    

    const handlesignupsubmit = async ( e) => {
        e.preventDefault();
        
        const { status, data, msg} = await callservermethod('http://localhost:5000/savory/api/signup', 
            { email: signupstate.email, password: signupstate.password, fname: signupstate.fname, lname: signupstate.lname});
        
        if ( status  == 200 ) 
        {
            localStorage.setItem('savory_access_token', data.savorytoken);
            history.push('/savory/main');
        }    
        else if(status == 409) {
            setErr(msg);        
        }
        else if (status == 500) {
            setErr(msg);
        }
    }

    return (
        <>
           <div className="columns is-vcentered">
                    <div className="column is-3">
                    </div>
                    <div className="column is-2">
                        <img src={savory}></img>
                    </div>
                    <div className="column"><h4 className="title is-4" style={{color:'#5b6e8c'}}>savory</h4></div>
                </div>
        <form onSubmit={handlesignupsubmit}>
            <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="signup_txt_firstname">first name</label>
                    </div>
                    <div className="column is-2"> 
                        <input   className="input is-small" value={signupstate.fname} onChange={ (e)=> { dispatchfn({act:'handle_change_fname' , valu: e.target.value}) } } type="text" id="signup_txt_firstname"></input>
                    </div>
                    <div className="column"></div>
             </div>       
            
            
             <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="signup_txt_lastname">last name</label>
                    </div>
                    <div className="column is-2">
                        <input  className="input is-small"  value={signupstate.lname} onChange={ (e)=> { dispatchfn({act:'handle_change_lname' , valu: e.target.value}) } } type="text" id="signup_txt_lastname"></input>
                    </div>
                    <div className="column"></div>
             </div>       
            
              
             <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="signup_txt_email" >email</label>
                    </div>
                    <div className="column is-2">
                         <input  className="input is-small" value={signupstate.email} onChange={ (e)=> { dispatchfn({act:'handle_change_email' , valu: e.target.value}) } }   type="text" id="signup_txt_email"></input>
                    </div>
                    <div className="column"></div>
             </div>       
            
            
              
             <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                        <label htmlFor="signup_pwd">password</label>
                    </div>
                    <div className="column is-2">
                          <input  className="input is-small"  value={signupstate.password} onChange={ (e)=> { dispatchfn({act:'handle_change_password' , valu: e.target.value}) } } type="text" id="signup_pwd"></input>
                    </div>
                    <div className="column"></div>
             </div>       
            
                
              
             <div className="columns">
                    <div className="column is-3">
                    </div>
                    <div className="column is-1">
                         <label htmlFor="signup_pwd_confirm">re enter password</label>
                    </div>
                    <div className="column is-2">
                        <input className="input is-small"  value={signupstate.password_confirm} onChange={ (e)=> { dispatchfn({act:'handle_change_password_confirm' , valu: e.target.value}) } } type="text" id="signup_pwd_confirm"></input>
                    </div>
                    <div className="column"></div>
             </div>       
            
             <div className="columns">
                    <div className="column is-3"> </div>
                    <div className="column is-2">
                        <button  className="button is-small" style={{marginRight:'4px'}}  type="submit" disabled={
                            signupstate.fname == '' || signupstate.lname == '' || signupstate.email == '' ||
                            signupstate.password == '' || signupstate.password_confirm == '' || 
                            signupstate.password_confirm != signupstate.password
                        } >signup</button>
                        <button  className="button is-small" style={{marginRight:'4px'}} type="button">clear</button>
                        <button   className="button is-small"  style={{marginRight:'4px'}} type="button" onClick={()=>{ history.push('/savory/login') }}>login</button>
                    </div>
                </div>

                <div className="columns">
                    <div className="column is-3"> </div>
                    <div className="column is-2"> 
                        <div className="content is-small">Icons made by <a href="https://www.flaticon.com/authors/icongeek26" title="Icongeek26">Icongeek26</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                    </div>
                </div>         
        </form>
        </>
    );
}

export  { Login , Signup};