DROP TABLE IF EXISTS sensor_readings;

CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    
    node_id INT NOT NULL,              
    sequence_number INT NOT NULL,  
    
    x_g DOUBLE PRECISION NOT NULL,    
    y_g DOUBLE PRECISION NOT NULL,      
    z_g DOUBLE PRECISION NOT NULL,     
    
    magnitude_g DOUBLE PRECISION,   
    magnitude_ms2 DOUBLE PRECISION,   
    
    created_at TIMESTAMP DEFAULT NOW()  
);