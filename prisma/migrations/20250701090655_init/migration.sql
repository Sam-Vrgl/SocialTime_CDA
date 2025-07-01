-- CreateTable
CREATE TABLE `utilisateur` (
    `id_utilisateur` VARCHAR(191) NOT NULL,
    `pseudo_utilisateur` VARCHAR(191) NOT NULL,
    `nom_utilisateur` VARCHAR(191) NOT NULL,
    `prenom_utilisateur` VARCHAR(191) NOT NULL,
    `email_utilisateur` VARCHAR(191) NOT NULL,
    `mdp_hash` VARCHAR(191) NOT NULL,
    `ddn_utilisateur` DATETIME(3) NULL,
    `pp_url_utilisateur` VARCHAR(191) NULL,
    `bio_utilisateur` VARCHAR(191) NULL,
    `role_utilisateur` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `utilisateur_pseudo_utilisateur_key`(`pseudo_utilisateur`),
    UNIQUE INDEX `utilisateur_email_utilisateur_key`(`email_utilisateur`),
    PRIMARY KEY (`id_utilisateur`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
