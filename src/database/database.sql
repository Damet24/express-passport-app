create if not exists database logindb;
use logindb;

create table users(
  id_user int primary key auto_increment,
  name varchar(500) not null,
  email varchar(500) not null,
  usar_password varchar(500) not null,
  phone_number int
);