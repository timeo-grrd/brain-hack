-- Insère des articles fictifs pour chaque carte attendue par le frontend
-- Les IDs sont générés (UUID v4), les slugs sont les mêmes que les card IDs

INSERT INTO articles (id, title, intro, sections, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'L’IA en vedette', '["Introduction à l’IA en vedette"]', '["Section 1", "Section 2"]', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'L’intelligence au téléphone', '["Introduction à l’intelligence au téléphone"]', '["Section 1", "Section 2"]', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'Les mensonges de ChatGPT', '["Introduction à ChatGPT"]', '["Section 1", "Section 2"]', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Manipulation en ligne', '["Introduction à la manipulation en ligne"]', '["Section 1", "Section 2"]', NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Détection de deepfake', '["Introduction à la détection de deepfake"]', '["Section 1", "Section 2"]', NOW()),
  ('66666666-6666-6666-6666-666666666666', 'Triche IA dans les jeux', '["Introduction à la triche IA"]', '["Section 1", "Section 2"]', NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Streamer et vidéos truquées', '["Introduction aux streamers truqués"]', '["Section 1", "Section 2"]', NOW()),
  ('88888888-8888-8888-8888-888888888888', 'Devoirs et IA', '["Introduction aux devoirs IA"]', '["Section 1", "Section 2"]', NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Métiers du futur', '["Introduction aux métiers du futur"]', '["Section 1", "Section 2"]', NOW()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'L’IA remplacera-t-elle l’humanité ?', '["Introduction à l’IA et l’humanité"]', '["Section 1", "Section 2"]', NOW());
