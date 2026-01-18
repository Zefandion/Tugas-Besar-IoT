DROP TABLE IF EXISTS sensor_readings;

CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    
    node_id INT NOT NULL,               -- ID numeric untuk masing-masing node
    sequence_number INT NOT NULL,       -- SN dari frame node
    
    x_g DOUBLE PRECISION NOT NULL,      -- nilai accelerometer X (raw g)
    y_g DOUBLE PRECISION NOT NULL,      -- nilai accelerometer Y (raw g)
    z_g DOUBLE PRECISION NOT NULL,      -- nilai accelerometer Z (raw g)
    
    magnitude_g DOUBLE PRECISION,       -- magnitude vector (g)
    magnitude_ms2 DOUBLE PRECISION,     -- magnitude dalam m/s^2
    
    created_at TIMESTAMP DEFAULT NOW()  -- waktu INSERT oleh server database
);