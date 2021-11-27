const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoclient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const pdfdoc = require('pdfkit');
const { ObjectId } = require('bson');
const fs = require('fs');


require('dotenv').config();

const corsoptions = {
    origin: 'http://localhost:3000',
    credentials:true
};

const port= 5000;
const app = express();
app.use(cors(corsoptions));
app.use(express.json());

let mdb;
mongoclient.connect(process.env.mongodb_conn,   (err, cl) =>{
    mdb=cl.db();
    app.listen(port);
    console.log('connected to mongodb');
});

app.post('/savory/api/login', async(req, res) => {
    const input=req.body;
    
    const user = await mdb.collection('users').findOne({email:input.email});
  
    if(user) {
        let password_ok = await bcrypt.compare(input.password ,user.password); 
        if( password_ok) {
            jwt.sign({ _id: user._id, email:user.email, fname: user.fname, lname: user.lname }
                , process.env.savory_jwt_secret
                ,{ expiresIn: '1h'}
                ,(err,token)=> {
                    if(err) { 
                        res.statusMessage='user could not be logged in. retry';
                        return res.status(500).json({err})}
                    else { return res.status(200).json({savorytoken:token})}
                });
        }
        else {
           
            res.statusMessage='user credentials not correct';
            return res.status(401).json(); // 401: unauthorized
        }
        
    }
    else {
       
        res.statusMessage='user credentials not correct';
        return res.status(401).json(); 
    }
    
})

app.post('/savory/api/signup', async (req,res)=>{
    const input = req.body;

    const saltrounds = 10;
    const salt =await bcrypt.genSalt(saltrounds);
    const hash =await bcrypt.hash(input.password, 10);

    const user = await mdb.collection('users').findOne({email:input.email});
    if(user) { 
        // user already exists.
        res.statusMessage='user with this email already exists';
        return res.status(409).json();
    }
    
    const result = await mdb.collection('users').insertOne({fname: input.fname, lname:input.lname, email: input.email, password: hash,
                                                                 lists:[]
                                                             });
                                                            if( result.acknowledged) {
    jwt.sign({ _id: result.insertedId, email:input.email, fname: input.fname, lname: input.lname }
                , process.env.savory_jwt_secret
                ,{ expiresIn: '1h'}
                ,(err,token)=> {
                    if(err) { 
                        res.statusMessage='user could not be created. retry';
                        return res.status(500).json({err})}
                    else { return res.status(200).json({savorytoken:token})}
                });
    }
    else {
        res.statusMessage='user could not be created. retry';
        return res.status(500).json({});
    }

});


app.post('/savory/api/getlists', async (req, res)=>{
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);
       
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
                const result = await mdb.collection('users').find({_id : objId}).toArray();

                if( result) {
                    return res.status(200).json(result);
                }
                else {
                    res.statusMessage='lists could not be fetched. retry';
                    return res.status(500).json(); 
                }
            }
        });
    }
});

app.post('/savory/api/addlist', async (req, res)=>{
    const {newList} = req.body;
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);
       
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
                const list = { listname : newList , liabout: '', liitems: [] }
                
                
                const listchk = await mdb.collection('users').findOne (
                    {
                        $and:[{_id: objId}, { 'lists.listname': newList }]

                    }
                    );
                if ( listchk ) {
                    res.statusMessage='list already exists';
                    return res.status(409).json({});
                }   
                else {
                    const result = await
                        mdb.collection('users').updateOne(
                        { _id: objId }, // query matching 
                        { $push: { lists: list } } 
                    );

                    if( result.acknowledged) {
                        return res.status(201).json();
                    }
                    else {
                        res.statusMessage='list could not be added. retry';
                        return res.status(500).json(); 
                    }
                }
            }
        } )
    }
});


app.post('/savory/api/togglestatus', async(req,res) =>{
    const {indx,listname,updtstatus} = req.body;
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);
       
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
               
                const result = await
                    mdb.collection('users').updateOne(
                    {   
                        $and:[{_id: objId}, { 'lists.listname': listname }]

                    }, 
                    {
                        $set: { [`lists.$.liitems.${indx}.status`] : updtstatus }
                    }
                   
                );

                if( result.acknowledged) {
                    return res.status(200).json({});
                }
                else {
                    res.statusMessage='list could not be added. retry';
                    return res.status(500).json({}); 
                }
                
            }
        } )
    }
})

app.post('/savory/api/addnewliitem', async(req,res) =>{
    const {newLiItem,listname} = req.body;
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);
       
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
                const litem = {title:newLiItem , status : 'incomplete'}
                const result = await
                    mdb.collection('users').updateOne(
                    {   
                        $and:[{_id: objId}, { 'lists.listname': listname }]

                    }, 
                    {
                        $push: { 'lists.$.liitems' : litem}
                    }
                   
                );

                if( result.acknowledged) {
                    return res.status(200).json({});
                }
                else {
                    res.statusMessage='list could not be added. retry';
                    return res.status(500).json({}); 
                }
                
            }
        } )
    }
})

app.post('/savory/api/genpdf', async (req, res) =>{
    const {listname} = req.body;
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);

        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
                let k = '';
                const doc = new pdfdoc();
                doc.pipe(fs.createWriteStream('output.pdf'));
             
                doc.image('images/savory.png', 100, 100);                                 
                doc.text('savory ['+ new Date() +']', 100, 200);

                const result = await mdb.collection('users').findOne({ 
                   $and:  [{_id: objId}, { 'lists.listname': listname }],

                });
                if( result.lists != null && result.lists.length > 0) {
                    for(let i of result.lists) {
                        if( i.listname ==  listname) {
                            if( i.liitems != null && i.liitems.length > 0) {
                                for(let j of i.liitems) {
                                    k = k + j.title + '['+ j.status +']' + ' | ';
                                }
                            }
                        }
                    }
                }   
                doc.text(k, 100, 300);
               
                doc.end();  
                res.status(201).json({}); 
                
            }
        } )
    }
})

app.post('/savory/api/addupdtliabout', async (req, res)=>{
    const {txtLiAbout,listname} = req.body;
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        var {_id} =JSON.parse( Buffer.from(token.split('.')[1] , 'base64') );
        
        var objId = new ObjectId(_id);
       
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
               
                const result = await
                    mdb.collection('users').updateOne(
                    {   
                        $and:[{_id: objId}, { 'lists.listname': listname }]

                    }, 
                    {
                        $set: { 'lists.$.liabout' : txtLiAbout}
                    }
                   
                );

                if( result.acknowledged) {
                    return res.status(200).json();
                }
                else {
                    res.statusMessage='list could not be added. retry';
                    return res.status(500).json(); 
                }
                
            }
        } )
    }
});

app.post('/savory/api/verifytoken', async (req, res)=>{
    const {authorization}=req.headers;
    if(!authorization) {
        res.statusMessage='no auth header in request';
        return res.status(401).json();
    }
    else{
        const token = authorization.split(' ')[1];
        jwt.verify(token , process.env.savory_jwt_secret, async(err,decoded) => {
            if(err){
                res.statusMessage='token could not be verified . not able to authenticate';
                return res.status(401).json(); // 401: unauthorized
            }
            else {
                return res.status(200).json();             
            }
        } )
    }
});