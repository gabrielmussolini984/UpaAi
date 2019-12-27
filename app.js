  // Import's
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const formidableMiddleware = require('express-formidable');
const fs = require('fs').promises;
const flash = require('connect-flash');
const session = require('express-session');



// Init App
const app = express();

app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: './'
}));

app.use(session({
  secret: "cursodenode",
  resave: true,
  saveUninitialized: true
}));
// Midleware
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next(); 
})

// HandleBars Config
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
// BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Public
//app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'assets')));

// Rota Default
app.get('/', (req, res)=>{
  req.flash('success_msg', 'Arquivo Copiado com Sucesso')
  res.render('home');
});

app.post('/upaai', (req,res)=>{
  let nomeTemporario = req.files.arquivo.path
  let nomeCorreto = req.files.arquivo.name 
  const renomeando = fs.rename('./'+nomeTemporario,'./'+nomeCorreto)
  renomeando
  .then(()=>{
    console.log('Arquivo Salvo com sucesso')
    req.flash('success_msg', 'Arquivo Copiado com Sucesso')
    //res.render('home')
    res.redirect('/#work')
  })
  .catch(err => {
    console.log('Erro ao salvar: '+err)
    let status = 'Erro ao Enviar Arquivo'
    res.render('/home', {status})
    
  })
  //console.log(renomeando)
  
  
})
app.get('#folder', (req, res)=>{
  console.log('teste')
  res.send('sda')
});


// Server Running
const port = process.env.PORT || 3000;
app.listen(port, (err)=>{
  if (err) console.log('Error');
  console.log('Server is online in port 3000');
});