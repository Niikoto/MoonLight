const selectImg = (cd_user,callback) => {
    const query = 'select * from imagem where cd_user = ?';
    db.query = (query,[cd_user],(err,results) => {
        if(err){
            callback(err,null);
        }
        if(results.length>0){
            callback(null,results);
        }
        else{
            console.log("Nenhum usuario encontrado");
            callback(null,false)
        }
    })
}

module.exports = { selectImg };