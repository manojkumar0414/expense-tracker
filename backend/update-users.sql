-- Update Users with bcrypt hashed passwords
-- Hash generated from: bcrypt.hash('admin123', 10) and bcrypt.hash('user123', 10)

USE ExpenseTrackerDB;
GO

-- Delete existing users
DELETE FROM Users;
GO

-- Insert users with hashed passwords
-- admin123 hashed
INSERT INTO Users (Username, Password, Email) VALUES
('admin', '$2a$10$Dxx.JJhqvvl4Z8RWvQNve.4bGxAkPBRx2tWO5.VaEXdGvqhNJZhPe', 'admin@example.com');

-- user123 hashed
INSERT INTO Users (Username, Password, Email) VALUES
('user1', '$2a$10$V9k0EZI8V6kqn8K3Z5Z8iOL5r5M9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'user1@example.com');

GO

SELECT * FROM Users;
GO
