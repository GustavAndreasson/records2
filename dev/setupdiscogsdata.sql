ALTER TABLE release_track_artist MODIFY COLUMN track_id INT;
ALTER TABLE release_track_artist ADD CONSTRAINT release_track_artist__track_fk FOREIGN KEY (track_id) REFERENCES `release_track` (id);
ALTER TABLE artist ADD sname VARCHAR(30) AS (LOWER(SUBSTRING(name, 1, 30))) STORED;
ALTER TABLE label ADD sname VARCHAR(30) AS (LOWER(SUBSTRING(name, 1, 30))) STORED;
CREATE INDEX sname ON artist (sname);
CREATE INDEX sname ON label (sname);