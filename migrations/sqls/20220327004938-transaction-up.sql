CREATE TABLE IF NOT EXISTS `transaction` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `core_id` varchar(15) NOT NULL,
    `location` varchar(11) NOT NULL,
    `quantity_change` int(10) NOT NULL,
    `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=latin1;
