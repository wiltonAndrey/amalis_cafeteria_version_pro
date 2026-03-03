-- Example menu_products chef_suggestion refresh
-- Sanitized sample for documentation only

START TRANSACTION;

UPDATE menu_products
SET chef_suggestion = 'Recién hecha es cuando mejor funciona.'
WHERE id = 98 AND active = 1;

UPDATE menu_products
SET chef_suggestion = 'Recién exprimido es cuando mejor está; pídelo al momento.'
WHERE id = 127 AND active = 1;

COMMIT;
