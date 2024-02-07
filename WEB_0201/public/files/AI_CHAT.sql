CREATE TABLE `user` (
	`stunum`	int				NOT NULL	PRIMARY KEY,
	`pw`		varchar(100)	NOT NULL,
	`name`	v	archar(100)		NOT NULL,
	`gender`	varchar(20)		NOT NULL,
	`faceimg`	LONGBLOB		NOT NULL
);

CREATE TABLE `user_chat` (
	`date`		DateTime		NOT NULL	PRIMARY KEY,
	`stunum`	int				NOT NULL,
	`chatlog`	varchar(16380)	NOT NULL
);

CREATE TABLE `user_point` (
	`date`			DateTime	NOT NULL	PRIMARY KEY,
	`stunum` 		int			NOT NULL,
	`has_glasses`	bool		NOT NULL
);

CREATE TABLE `user_check` (
	`date`	DateTime	NOT NULL	PRIMARY KEY,
	`stunum`	int		NOT NULL
	
);


ALTER TABLE `user_chat` ADD CONSTRAINT `FK_user_TO_user_chat_1` FOREIGN KEY (
	`stunum`
)
REFERENCES `user` (
	`stunum`
);

ALTER TABLE `user_point` ADD CONSTRAINT `FK_user_TO_user_point_1` FOREIGN KEY (
	`stunum`
)
REFERENCES `user` (
	`stunum`
);

ALTER TABLE `user_check` ADD CONSTRAINT `FK_user_TO_user_check_1` FOREIGN KEY (
	`stunum`
)
REFERENCES `user` (
	`stunum`
);

