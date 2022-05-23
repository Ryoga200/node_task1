// GET method route
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql2');
const fs = require('fs');
const ejs = require('ejs');

//const connection = require('./mysqlConnection');
var mime = {
  ".html": "text/html",
  ".css":  "text/css"
  // 読み取りたいMIMEタイプはここに追記
};

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', //この部分は秘密です
  database: 'database_development'
});
connection.connect();


connection.query(
  'SELECT * FROM Todos',
  function(err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

const app = express()
app.set('ejs',ejs.renderFile);
app.use(express.static('views'))
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());


app.get('/', (req, res) => {
  
  connection.query('SELECT * FROM ?? ',['Todos'], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    console.log(results);
  res.render('main',{data:results});
   
});

  })
  app.post('/create', (req, res) => {
    const pos=req.body.todo;
    console.log(pos);
    if(pos!=""){
    connection.query('INSERT INTO Todos set ?; ',{task: pos}, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(results);
     
      
  });};
  console.log("aaa" + pos);
  res.redirect('/');
  })
  // POST method route
  app.post('/', (req, res) => {
    res.send('POST request to the homepage')
  })
  app.post('/delete', (req, res) => {
    const id=req.body.id;
    console.log(id);
    if(id!=""){
    connection.query('DELETE FROM Todos WHERE id = ?; ',id, function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      console.log(results);
    
      
  });};
  res.redirect('/');
});
 app.post('/edit', async (req, res) => {
   console.log("cccccc");
   async function bring (id) {
    // `var ret`は不要

    // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
    const data = await new Promise((resolve, reject) => {
        connection.query('select * FROM Todos WHERE id = ?; ',id,
            (error, results, fields) => {
                resolve({
                    error: error,
                    results: results,
                    fields: fields
                });
                console.log(results[0].task+"bb");
            }
        );


   
});
  
return data.results[0];
   };
  
  const id=req.body.id;
  console.log(id);
  if(id!=""){
   
watasu= await bring(id);

 res.render('edit',{data:watasu});
}else{
  res.redirect('/');
}
}
);
app.post('/update', async (req, res) => {
  async function bring (id) {
   // `var ret`は不要

   // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
   const data = await new Promise((resolve, reject) => {
       connection.query('select * FROM Todos WHERE id = ?; ',id,
           (error, results, fields) => {
               resolve({
                   error: error,
                   results: results,
                   fields: fields
               });
               console.log(results[0].task+"bb");
           }
       );


  
});
return data.results[0];
  };
 
 const id=req.body.id;
 const task=req.body.todo;
 console.log("aaa"+task);
 console.log(id);
 if(id!=""){
  
watasu= await bring(id);
connection.query('UPDATE Todos SET task=? WHERE id=?; ',[task,watasu.id], function (error, results, fields) {
  if (error) throw error;
  console.log(results);
  console.log(results);

  
});
res.redirect('/');
}else{
 res.redirect('/');
}
}
);

app.post('/search', async (req, res) => {
  async function bring (word) {
   // `var ret`は不要
   // `new Promise`の前に`await`を付けることで、`Promise`の解決を待つ
   const data = await new Promise((resolve, reject) => {
       connection.query('SELECT * FROM Todos WHERE task LIKE ?;','%'+word+'%',
           (error, results, fields) => {
               resolve({
                   error: error,
                   results: results,
                   fields: fields
               });
               console.log(results);
               console.log(word+"bbb");
           }
       );


  
});
return data.results;
  };
 
 const word=req.body.word;
 console.log("aaa"+word);

  
watasu= await bring(word);
console.log(watasu);
res.render('main',{data:watasu});
}
);

  app.listen(3000,'localhost');