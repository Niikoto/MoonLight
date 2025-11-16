//essa parte está fazendo uma requisicao para uma biblioteca do node, express usado para banco e path usado para rotas
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const multer = require('multer');

const {authenticateUser, cadUser, UploadFoto, InsertImagem} = require('./user');//Funcao de autentificacao e cadastro
const {selectImg} = require('./img');
const { render } = require('ejs');

const app = express();// estou salvando na variavel app a variavel express que esta fazendo a requisicao

app.use(bodyparser.urlencoded({extended: true}));//Usar o express junto como o bodyparser para analisar os dados enviados pelo post que acabam sendo muito complexo dados que estao na url


app.use(session({//Iniciando sessao
  secret: '2723081325p',//Senha da sessao
  resave: false,//somente vai salvar os dados da sessao quando algo sofrer alteracao
  saveUninitialized: true,//Salva sessões mesmo quando estão vazias
  cookie: {//confiracao de cookies
    secure: false,//Permite o funcionamento da sessao em http
    httpOnly: true,//Impede injecao de dados via js
    sameSite: 'lax'//Permite interacao com cookies de outros sites
  }
}));

//Confiracao de paginas
app.set('view engine','ejs');//configurando o gerador de templet

app.set('views',path.join(__dirname,'views'));//Configurando para mostrar onde estao as views

app.use('/',express.static(path.join(__dirname,'public')));//Defini essa pasta como static, onde tudo iniciara, direcionei o caminho com o path e o express

app.get('/perfil',(req,res) => {//quando for feita qualquer requisicao de pagina
  return res.render('perfil', { user: req.session.user })
});

app.get('/home',(req,res) => {
  if(req.session.user){
    return res.render('home', { user: req.session.user });
  }
  else{
    return res.redirect('/');
  }
});

app.get('/fotos',(req,res) =>{
  return res.render('fotos', { user: req.session.user });
});

app.get('/album',(req,res) =>{
  return res.render('album', { user: req.session.user });
});

//Configuracao de salvamento de imagem
const storage = multer.diskStorage({//salvando na variavel storege o destino do arquivo
  destination: (req, file, cb) => {//Predefinindo o local em que o arquivo vai ser salvo, puxando paramentro de requisicao arquvi, e resposta do banco de dados
    cb(null, path.join(__dirname, '/public/upload/pictures'));
  },
  filename: (req, file, cb) =>{//Preparação do nome do arquivo
    cb(null, Date.now() + path.extname(file.originalname));//e ajuncao da data e nome da extensao do arquivo
  }
})

const storage_img = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null, path.join(__dirname, '/public/upload/profile_img'));
  },
  filename: (req,file,cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({storage: storage});
const insert_img = multer({storage: storage_img});

//Faz uma requicao e pega os resultados e chama a funcao para autentificar o que foi enviado no post
app.post('/login',(req ,res) => {//Pegando os dados do formularios e salvando em req.body
  const {email, senha} = req.body;
  console.log(email,senha);//Para mostrar no servidor

  authenticateUser(email,senha,(err,isAuthenticated)=> {//Chamando a funcao authenticateUser(que esta em auth.js) isAuthenticated esta servindo como parametro de results
    if(err){
      console.log("Falha no servidor, tente novamente");
      return res.status(500).send("Erro no servidor");
    }
    if(isAuthenticated){
      req.session.user = {
        id: isAuthenticated.id_user,
        name: isAuthenticated.nome,
        email: isAuthenticated.email,
        img: isAuthenticated.foto_perfil//criando uma sessao para o usario
      }
      return res.redirect('/home');
    }else{
      console.log("Email ou senha errados")
      return res.redirect('/?error=invalid_credentials');
    }
  });

});

//Pega as informacoes para jogar na pagina de login
app.get('/user-info',(req,res)=>{//pega as informacoes adquiridas em /login e guarda em req.session.user no formaro json, isso quando chamar /user-info
  if(req.session.user){
    res.json({
      id: req.session.user.id,
      name: req.session.user.name,
      email: req.session.user.email,
      img: req.session.user.img//puxando os dados da sessao do usuario em json
    });
  }
  else{
    res.status(401).json({error: "Sessão sem usurio"});
  }
});

app.post('/cad',(req, res) =>{//Requisicao de cadastro
  const {nome,email,senha} = req.body;//salva as informacoes em uma strig
  console.log(nome,email,senha);//Mostra as informacoes no servidor

  cadUser(nome,email,senha,(err,isCad) =>{//chama a funcao do user.js para cadastrar
    if(err){//se der erro ao chamar funcao
      console.error("Não foi possivel realizar o cadastro")
      res.redirect('/?error_cad=Cadastro nao realizado');
    }
    else if(isCad){//se a resposta existir ele manda o usuario para a home
      console.log("Cadastro realizado com sucesso");
      return res.redirect('/?success=Cadastro realizado com sucesso');
    }
  })
})

app.post('/alt-img', upload.single('foto_perfil'),(req, res) =>{//Ao receber uma requisicao post, sando somente um arquivo no campo foto_perfil (o upload usado foi o que foi configurado no salvamento do multer)
  console.log(req.file);
  const id_user = req.session.user.id;//Pegando o id do usuario na sessao
  if(!req.file){//se nao houver nenhum arquivo enviado
    return res.status(400).send("Nenhuma imagem inviada");
  }
  const foto_Perfil = req.file.filename;//salva o nome da foto em foto_perfil

  UploadFoto(foto_Perfil, id_user, (err, result) =>{//chama a funcao uploadfoto pasando os parametros nome da foto id do usuario e retornando as respostas
    if(err){
      return res.status(500).send("Erro ao salvar imagem");//erro ao tentar salvar a imagem
    }
    console.log("Imagem salva");
    req.session.user.img = foto_Perfil;//Atualizando o nome da foto na sessao
    res.redirect('/perfil');//imagem foi salva, mando o usuario para pagina de perfil novamente
  });
});

app.post('/insert-img', insert_img.single('nome_imagem'),(req, res) =>{
  console.log(req.file);
  const {titulo_img,descricao_img} = req.body;
  const cd_user = req.session.user.id

  if(!req.file){
    return res.status(400).send("Nenhuma imagem enviado para o sistema");
  }

  const nome_imagem = req.file.filename;

  InsertImagem(titulo_img,nome_imagem, cd_user, descricao_img, (err,result) =>{
    if(err){
      return res.status(500).send("Erro ao Inserir a imagem no sistema");
    }
    console.log("Imagem Nova inserida no sistema");
    res.redirect('/home');
  })
});

app.get('/selectImagens', (req,res)=>{
  const cd_user = req.session.user.id;
  selectImg(cd_user,(err,result) =>{
    if(err){
      return res.status(500).send("Erro ao procurar imagens");
    }
    return console.log('Imagens carregadas com sucesso', {imagens: result});
  })
})

const PORT = 3000;// Variavel que guarda a porta

// variavel app.listen faz com que quando o servidor iniciar na porta desejada
app.listen(PORT,() =>{
  console.log('Tudo foi iniciado na porta: ',PORT)
});