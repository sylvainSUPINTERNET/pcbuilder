ALTER TABLE components
ADD COLUMN hash TEXT CONSTRAINT components_hash_unique UNIQUE;