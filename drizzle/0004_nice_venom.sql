ALTER TABLE `waitlist` ADD `referralCode` varchar(12);--> statement-breakpoint
ALTER TABLE `waitlist` ADD `referredBy` varchar(12);--> statement-breakpoint
ALTER TABLE `waitlist` ADD CONSTRAINT `waitlist_referralCode_unique` UNIQUE(`referralCode`);