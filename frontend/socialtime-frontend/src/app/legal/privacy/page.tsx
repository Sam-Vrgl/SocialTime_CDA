// src/app/legal/privacy/page.tsx

export const metadata = {
  title: 'Politique de Confidentialité – SocialTime',
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Politique de Confidentialité</h1>

      <p>
        La présente Politique de Confidentialité décrit la manière dont SocialTime (« nous », « notre ») collecte,
        utilise et protège les données personnelles des utilisateurs (« vous », « votre ») de la plateforme.
      </p>

      <h2>1. Données collectées</h2>
      <ul>
        <li><strong>Inscription :</strong> nom, prénom, adresse e-mail, nom d’utilisateur et mot de passe.</li>
        <li><strong>Contenu utilisateur :</strong> textes, images, vidéos que vous publiez.</li>
        <li><strong>Métadonnées :</strong> date et heure de connexion, adresse IP, type de navigateur.</li>
        <li><strong>Cookies et traceurs :</strong> identifiants de session, préférences de navigation.</li>
      </ul>

      <h2>2. Finalités du traitement</h2>
      <p>
        Vos données sont utilisées pour :
      </p>
      <ul>
        <li>Fournir et personnaliser les services de SocialTime.</li>
        <li>Assurer la sécurité et la prévention des fraudes.</li>
        <li>Analyser l’utilisation et améliorer la plateforme.</li>
        <li>Vous envoyer des notifications et communications liées au service.</li>
      </ul>

      <h2>3. Partage et diffusion</h2>
      <p>
        Nous ne vendons ni ne louons vos données. Elles peuvent être partagées avec :
      </p>
      <ul>
        <li>Nos prestataires techniques (hébergement, maintenance).</li>
        <li>Autorités légales si la loi l’exige.</li>
      </ul>

      <h2>4. Cookies et traceurs</h2>
      <p>
        Des cookies sont déposés pour :
      </p>
      <ul>
        <li>Maintenir votre session active.</li>
        <li>Conserver vos préférences d’affichage.</li>
        <li>Mesurer l’audience via des outils anonymisés.</li>
      </ul>
      <p>
        Vous pouvez gérer ou refuser les cookies depuis les paramètres de votre navigateur.
      </p>

      <h2>5. Sécurité</h2>
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données
        contre tout accès non autorisé, divulgation ou altération.
      </p>

      <h2>6. Durée de conservation</h2>
      <p>
        Vos données d’inscription sont conservées tant que votre compte existe. Le contenu publié
        reste stocké jusqu’à sa suppression par vous ou par nos soins en cas de violation.
      </p>

      <h2>7. Vos droits</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, vous disposez de :
      </p>
      <ul>
        <li>Un droit d’accès, de rectification et de suppression.</li>
        <li>Un droit de limitation ou d’opposition au traitement.</li>
        <li>Un droit à la portabilité de vos données.</li>
      </ul>
      <p>
        Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@socialtime.example.com">privacy@socialtime.example.com</a>.
      </p>

      <h2>8. Modifications de la politique</h2>
      <p>
        Nous pouvons mettre à jour cette Politique. Toute modification sera publiée ici avec la date
        de « Dernière mise à jour » et prendra effet 30 jours après publication.
      </p>

      <p style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-muted)' }}>
        Dernière mise à jour : 11 juillet 2025
      </p>
    </main>
  );
}
