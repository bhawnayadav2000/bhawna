const express = require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt-nodejs');
const cors=require('cors');
const knex= require('knex');

const postgres= knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smartbrain'
  }
});
 
console.log(postgres.select('*').from ('users'));
const app=express();

app.use(bodyParser.json());
app.use(cors());

const database={
    user:[
    {
        id:'124',
        name:'john',
        email:'john@gmail.com',
        password:'cookies',
        entries:0,
        joined: new Date()
    },
    {
        id:'123',
        name:'cook',
        email:'jo@gmail.com',
        password:'cook',
        entries:0,
        joined: new Date()
    }
]
}

app.get('/',(req,res)=>{
    res.send(database.user);
})

app.post('/signin',(req,res)=>
         {
    if(req.body.email===database.user[0].email&&req.body.password===database.user[0].password)
        {
            res.json('success');
        }
    else
        {
            res.status(400).json('error logging in');
        }
    
})

app.post('/register',(req,res)=>
        {
    const {email,password,name} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash);
});
    database.user.push({
        id:'125',
        name:name,
        email:email,
        password:password,
        entries:0,
        joined: new Date()
    })
    res.json(database.user[database.user.length-1]);
})

app.get('/profile/:id',(req,res)=>
       {
    const {id} = req.params;
    let found = false;
    database.user.forEach(user=>
                         {
        if(user.id===id)
            {
                found=true;
                return res.json(user);
            }
    })
    if(!found)
        {
            res.status(404).json('not found');
        }
})

app.put('/image',(req,res)=>
       {
    const {id} = req.body;
    let found = false;
    database.user.forEach(user=>
                         {
        if(user.id===id)
            {
                found=true;
                user.entries++;
                return res.json(user.entries);
            }
    })
    if(!found)
        {
            res.status(404).json('not found');
        }
})



// Load hash from your password DB.
/*bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
});*/

app.listen(3000);