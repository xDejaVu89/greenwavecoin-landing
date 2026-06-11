CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`milestone` enum('tasks_100','tasks_1000','tasks_10000','top_10') NOT NULL,
	`txHash` varchar(128),
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
