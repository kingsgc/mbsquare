-- ============================================================
-- DataWise: Rebrand sitesettings table
-- ============================================================
-- Updates all branding references in the sitesettings table
-- from old names to DataWise.
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Update sitesettings row (sId = 1)
UPDATE `sitesettings` SET
  `sitename`         = 'DataWise',
  `siteurl`          = 'https://datawise.com.ng/',
  `apidocumentation` = 'https://datawise.com.ng/api.html',
  `email`            = 'support@datawise.com.ng',
  `facebook`         = '',
  `twitter`          = '',
  `instagram`        = '',
  `telegram`         = ''
WHERE `sId` = 1;

-- Also update any other rows that might reference old branding
UPDATE `sitesettings` SET
  `siteurl` = REPLACE(`siteurl`, 'atyonlinesolution.com.ng', 'datawise.com.ng'),
  `apidocumentation` = REPLACE(`apidocumentation`, 'atyonlinesolution.com.ng', 'datawise.com.ng'),
  `email` = REPLACE(`email`, 'atyonlinesolution.com.ng', 'datawise.com.ng')
WHERE `siteurl` LIKE '%atyonlinesolution%'
   OR `apidocumentation` LIKE '%atyonlinesolution%'
   OR `email` LIKE '%atyonlinesolution%';

COMMIT;

-- ============================================================
-- Verify the changes
-- ============================================================
SELECT 
  `sitename`,
  `siteurl`,
  `apidocumentation`,
  `email`,
  `phone`,
  `whatsapp`
FROM `sitesettings`
WHERE `sId` = 1;

-- ============================================================
-- Done. sitesettings table is now rebranded to DataWise.
-- ============================================================
