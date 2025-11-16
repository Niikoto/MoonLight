const db = require('./db');

const authenticateUser = (email,senha,callback) => {

    const query = "select * from user where email = ? and senha = ?";
    db.query(query,[email,senha],(err,results) =>{
        if(err){
            callback(err,null);
        }

        if(results.length>0){
            console.log("Foi encontrado o usuario");
            callback(null,results[0]);//poderia ser true porem so falaria que encontrou algo, ja com results[0] guarda as informacao do usuario
        }
        else{
            console.log("usuario não encontrado");
            callback(null,false);
        }
    })
}

//Funcao de cadastro de usuario
const cadUser = (nome, email, senha, callback) =>{//parametros para funcao sendo o callback um retorno para outra funcao
    const query = 'insert into user (nome,email,senha) values (?,?,?)';//query insert com os parametros da table ususario
    db.query(query,[nome,email,senha],(err,results) => {//funcao query da biblioteca do express com o parametros query variavel com os parametros de nome email e senha, retornando errro ou um resultado
        if(err){
            console.error("Erro ao cadastrar o ususario");
            return callback(err,null);
        }
        else{
            return callback(null,true);
        }
    })
}

//UploadFoto
const UploadFoto = (foto_perfil, id_user, callback) =>{
    const query = 'update user set foto_perfil = ? where id_user = ?';
    db.query(query,[foto_perfil,id_user],(err,results)=>{
        if(err){
            console.error("Erro ao salvar a imagem");
            return callback(err, null);
        }
        callback(null, results);
    })
}

const InsertImagem = (titulo_img, nome_imagem, id_user,descricao_img, callback) =>{
    const query = 'insert into imagem (titulo_img,nome_imagem,cd_user,descricao_img) values (?,?,?,?);'
    db.query(query,[titulo_img,nome_imagem,id_user,descricao_img],(err,results) =>{
        if(err){
            console.err("Erro ao salvar imagem");
            return callback(err, null);
        }
        callback(null,results);
    });
}

module.exports = {
    authenticateUser,
    cadUser,
    UploadFoto,
    InsertImagem
};//exportando duas funcoes