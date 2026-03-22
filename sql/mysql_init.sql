-- BrainHack MySQL initialization script
-- Target: local MySQL 8+

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS brainhack
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE brainhack;

-- Drop in dependency order for clean re-runs
DROP TABLE IF EXISTS gamesessions;
DROP TABLE IF EXISTS article_likes;
DROP TABLE IF EXISTS article_comments;
DROP TABLE IF EXISTS minigames;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id CHAR(36) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pseudo VARCHAR(120) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
  avatar_url VARCHAR(2048) NULL,
  total_xp INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_total_xp (total_xp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE articles (
  id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  intro JSON NOT NULL,
  sections JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_articles_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE article_comments (
  id CHAR(36) NOT NULL,
  article_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  user_pseudo VARCHAR(120) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comments_article_id (article_id),
  KEY idx_comments_user_id (user_id),
  KEY idx_comments_created_at (created_at),
  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id)
    REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE article_likes (
  id CHAR(36) NOT NULL,
  article_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_article_likes_article_user (article_id, user_id),
  KEY idx_likes_user_id (user_id),
  KEY idx_likes_created_at (created_at),
  CONSTRAINT fk_likes_article
    FOREIGN KEY (article_id)
    REFERENCES articles(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_likes_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE minigames (
  id CHAR(36) NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  max_xp_possible INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_minigames_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gamesessions (
  id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  minigame_id CHAR(36) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  xp_earned INT UNSIGNED NOT NULL DEFAULT 0,
  completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gamesessions_user_id (user_id),
  KEY idx_gamesessions_minigame_id (minigame_id),
  KEY idx_gamesessions_completed_at (completed_at),
  CONSTRAINT fk_gamesessions_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_gamesessions_minigame
    FOREIGN KEY (minigame_id)
    REFERENCES minigames(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
