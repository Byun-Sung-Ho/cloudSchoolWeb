create database myboard default character SET UTF8;

use myboard;

create table post(
id int(11) not null auto_increment,
title varchar(100) not null,
content text null,
created datetime not null,
writer varchar(100) null,
email varchar(100) null,
primary key(id));

desc post;

insert into post (title, content, created, writer, email) values('삶은', '계란이다',
now(), 'lee', 'lee@naver.com');

insert into post (title, content, created, writer, email) values('위대하다', '밥을 많이 먹어서',
now(), 'lee', 'lee@naver.com');

insert into post (title, content, created, writer, email) values('나의 성격 유형', 'infj',
now(), 'kim', 'kim@naver.com');

insert into post (title, content, created, writer, email) values('가을바람', '가을은 쓸쓸하다',
now(), 'park', 'park@naver.com');

insert into post (title, content, created, writer, email) values('언젠가부터', '사람들과 이해관계가 힘들어지는 것 같다',
now(), 'lee', 'lee@naver.com');

select id, title, content from post;

select * from post WHERE id > 2;

select * from post where writer = 'lee';

select * from post order by id DESC;

select * from post limit 2;

update post set content = '성격 파탄자' where id = 3;

delete from post where id = 2;

rename table post to post_bk;

create table post(
id int(11) not null auto_increment,
title varchar(100) not null,
content text null,
created datetime not null,
profile_id INT(11) DEFAULT NULL,
primary key(id));

create table profile(
id int(11) not null auto_increment,
writer varchar(30) not null,
email varchar(100) default null,
primary key(id));

insert into post (title, content, created, profile_id) values('삶은', '계란이다',
now(), 1);

insert into post (title, content, created, profile_id) values('위대하다', '밥을 많이 먹어서',
now(), 1);

insert into post (title, content, created, profile_id) values('나의 성격 유형', 'infj',
now(), 2);

insert into post (title, content, created, profile_id) values('가을바람', '가을은 쓸쓸하다',
now(), 3);

insert into post (title, content, created, profile_id) values('언젠가부터', '사람들과 이해관계가 힘들어지는 것 같다',
now(), 1);

select * from post left join profile on post.profile_id = profile.id;

update profile set email = 'lee@daum.net' where id = 1;

select post.id, title, content, created, writer, email
from post
left join profile on post.profile_id = profile.id;

