-- Make PO dates optional so products can be catalog-only menu items.
ALTER TABLE `Product` MODIFY COLUMN `poOpenDate` DATETIME(3) NULL;
ALTER TABLE `Product` MODIFY COLUMN `poCloseDate` DATETIME(3) NULL;

-- Product branding and orderability fields.
ALTER TABLE `Product`
  ADD COLUMN `category` VARCHAR(191) NULL DEFAULT 'Mochi Daifuku',
  ADD COLUMN `variant` VARCHAR(191) NULL,
  ADD COLUMN `badge` VARCHAR(191) NULL,
  ADD COLUMN `isOrderable` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- Order pickup/danus details.
ALTER TABLE `Order`
  ADD COLUMN `pickupMethod` VARCHAR(191) NULL DEFAULT 'pickup',
  ADD COLUMN `pickupDate` DATETIME(3) NULL,
  ADD COLUMN `pickupTime` VARCHAR(191) NULL,
  ADD COLUMN `pickupLocation` TEXT NULL,
  ADD COLUMN `faculty` VARCHAR(191) NULL,
  ADD COLUMN `notes` TEXT NULL;

-- Store item unit price so old/new admin can show subtotal reliably.
ALTER TABLE `OrderItem`
  ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE `OrderItem` MODIFY COLUMN `subtotal` DOUBLE NOT NULL;

-- Reviews can be public/anonymous and product selection is optional.
ALTER TABLE `Review` MODIFY COLUMN `productId` INTEGER NULL;
ALTER TABLE `Review` ADD COLUMN `isAnonymous` BOOLEAN NOT NULL DEFAULT false;
