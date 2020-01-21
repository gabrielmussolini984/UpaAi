  // Import's
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');
const formidableMiddleware = require('express-formidable');
const fs = require('fs').promises;
const flash = require('express-flash');
const session = require('express-session');
const { middlewareGlobal} = require('./middlewares/middleware');

// Init App
const app = express();

// HandleBars Config
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

// BodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Configure Formidable
app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: path.resolve(__dirname, 'arquivos'),
  maxFileSize: 1 * 1024 * 1024
}));

// Public
app.use(express.static(path.join(__dirname,'assets')));

// Session
app.use(session({
  secret: 'kasdasdasdasdcat',
  resave: false,
  saveUninitialized: true,
}))
// Flash Messages
app.use(flash());
// MiddleWare Global
app.use(middlewareGlobal);


// Rota Default
app.get('/', (req, res)=>{
  res.render('home')
});
app.post('/upaai', async (req,res)=>{
  let nomeTemporario = req.files.arquivo.path
  let nomeCorreto = req.files.arquivo.name 
  try {
    await fs.rename(path.resolve(__dirname, 'arquivos', nomeTemporario),path.resolve(__dirname, 'arquivos', nomeCorreto), );
    //await fs.rename(nomeTemporario,nomeCorreto);
    req.flash('success', 'Arquivo Enviado com Sucesso');  
    return res.redirect('/#work');
  } catch (error) {
    console.log(error);
    req.flash('error', 'Erro ao Enviar o Arquivo');
  }
})

// Server Running
const port = process.env.PORT || 3000;
app.listen(port, (err)=>{
  if (err) console.log('Error');
  console.log('Server is online in port 3000');
});