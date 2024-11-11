CREATE TABLE app_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
--
--CREATE TABLE recipes (
--    id SERIAL PRIMARY KEY,
--    recipe_id BIGINT NOT NULL,
--    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
--);
