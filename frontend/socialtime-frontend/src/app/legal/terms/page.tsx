// src/app/legal/terms/page.tsx

export const metadata = {
  title: 'Conditions Générales d’Utilisation – SocialTime',
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Conditions Générales d’Utilisation</h1>

      <p>
        Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les
        droits et obligations de SocialTime et de ses utilisateurs dans le cadre de l’accès et
        de l’utilisation de la plateforme SocialTime (ci-après « le Service »).
      </p>

      <h2>Article 1 – Définitions</h2>
      <p>
        <strong>Utilisateur</strong> : toute personne accédant au Service, membre ou non.  
        <strong>Compte</strong> : espace personnel sécurisé créé par l’Utilisateur après
        inscription.  
        <strong>Contenu</strong> : textes, images, vidéos ou tout autre élément publié par un
        Utilisateur.
      </p>

      <h2>Article 2 – Accès au Service et Inscription</h2>
      <p>
        L’accès au Service est libre et gratuit pour tout Utilisateur majeur ou mineur âgé de
        13 ans ou plus. Pour publier du Contenu, l’Utilisateur doit créer un Compte en fournissant
        des informations exactes. Il est responsable de la confidentialité de ses identifiants.
      </p>

      <h2>Article 3 – Contenu Utilisateur</h2>
      <p>
        L’Utilisateur conserve la propriété de son Contenu. En publiant, il accorde à SocialTime
        une licence non exclusive, mondiale et gratuite lui permettant de reproduire, représenter
        et adapter ce Contenu dans le cadre du Service.
      </p>
      <p>
        L’Utilisateur s’engage à ne pas diffuser de Contenu illicite, diffamatoire, pornographique,
        haineux ou violent. SocialTime se réserve le droit de modérer, supprimer ou rendre privé
        tout Contenu contrevenant à la loi ou aux présentes CGU.
      </p>

      <h2>Article 4 – Propriété Intellectuelle</h2>
      <p>
        Tous les éléments de l’interface (textes, graphismes, logos, images, vidéos, sons,
        logiciels) sont protégés par le droit d’auteur et la propriété intellectuelle. Toute
        reproduction est strictement interdite sauf autorisation expresse de SocialTime.
      </p>

      <h2>Article 5 – Données Personnelles</h2>
      <p>
        Les données personnelles collectées sont traitées conformément à la
        <a href="/legal/privacy"> Politique de Confidentialité</a>. L’Utilisateur dispose d’un droit
        d’accès, de rectification et de suppression en contactant privacy@socialtime.example.com.
      </p>

      <h2>Article 6 – Responsabilités</h2>
      <p>
        SocialTime fournit le Service « tel quel » sans garantie expresse ni implicite. SocialTime
        ne saurait être tenu responsable des dommages directs ou indirects résultant de l’utilisation
        ou de l’impossibilité d’utilisation du Service.
      </p>

      <h2>Article 7 – Modification des CGU</h2>
      <p>
        SocialTime peut modifier à tout moment les présentes CGU. Les nouvelles conditions seront
        publiées sur cette page avec une date de « Dernière mise à jour ». Elles entreront en vigueur
        30 jours après leur publication.
      </p>

      <h2>Article 8 – Droit Applicable et Litiges</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux de Paris
        seront seuls compétents.
      </p>

      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
        Dernière mise à jour : 11 juillet 2025
      </p>
    </main>
  );
}
