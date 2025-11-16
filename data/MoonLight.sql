create database MoonLight;

use MoonLight;

create table user(
	id_user int auto_increment primary key,
    email varchar(150) not null unique,
    nome varchar(100) not null,
    senha varchar(255) not null,
    foto_perfil varchar(255) default null,
    data_criacao timestamp default current_timestamp
);

create table album(
	id_album int auto_increment primary key,
    nome_album varchar(255) not null,
    descricao_album text,
    cd_user int not null,
    data_album timestamp default current_timestamp,
    foreign key (cd_user) references user(id_user)
);

create table imagem(
	id_imagem int auto_increment primary key,
    nome_imagem varchar(255),
    descricao_img text,
    cd_user int not null,
    data_imagem timestamp default current_timestamp,
    foreign key (cd_user) references user(id_user) 
);

create table album_imagem(
	id_album_img int auto_increment primary key,
    cd_album int not null,
    cd_imagem int not null,
    foreign key (cd_album) references album(id_album),
    foreign key (cd_imagem) references imagem(id_imagem)
);

create table compartilhar(
	id_compartilhar int auto_increment primary key,
    cd_user int not null,
    cd_album int not null,
    permissao enum('view','edit') default 'view',
    foreign key (cd_user) references user(id_user),
    foreign key (cd_album) references album(id_album)
);

select * from user;	
select * from album;
select * from imagem;