const mysql = require('mysql2'); //Requisicao de biblioteca mysql do node

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MoonLight'
});//Criando concecao atravez do creatconnection

db.connect((err) => {
    if(err){
        console.log("Não foi possivel acessar o banco de dados, mensagem de erro ",err,message);
    }
    console.log("Banco de dados acessado com successo")
});//Estabelecendo conecao com o banco

module.exports = db;//Importando coneccao com outros arquivos