-- Drop table if exists
DROP TABLE IF EXISTS webhooks;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    url VARCHAR(255) NOT NULL,
    expedition VARCHAR(50) NOT NULL,
    receiptno VARCHAR(255) UNIQUE NOT NULL,
    isactive TINYINT(1) DEFAULT '1',
    lasthash TEXT,
    additionalargs TEXT
);
