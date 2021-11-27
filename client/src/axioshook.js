import axios from 'axios';
const callservermethod  =  async (url, postdata = {}) =>{
  

    try {
        const savory_access_token= localStorage.getItem('savory_access_token');
        const response = await axios.post(url, postdata, { headers:  { authorization: `Bearer ${savory_access_token}`}});
        //console.log(response);
        return { status: response.status,  msg: 'ok',  data: response.data };
    }
    catch(err) 
    {
        console.log(err)
        return {status: err.response.status , msg : err.response.statusText, data: null} ;
    }
}
export {callservermethod} ;