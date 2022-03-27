CREATE TABLE IF NOT EXISTS `stock` (
    `warehouse` varchar(16) DEFAULT NULL,
    `core_id` varchar(15) DEFAULT NULL,
    `location` varchar(11) DEFAULT NULL,
    `quantity` int(11) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
