// src/components/Footer.tsx
'use client';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p>
          © {new Date().getFullYear()} SocialTime SARL au capital de 10 000 € –  
          RCS Paris 123 456 789 – SIRET 123 456 789 00010 – TVA FR12 345678901  
        </p>
        <p>
          Siège social : 10 rue de la Paix, 75002 Paris –  
          Directeur de la publication : Jean Dupont –  
          Hébergeur : OVH, 2 rue Kellermann, 59100 Roubaix.
        </p>
        <p>
          Conformément à la loi “Informatique et Libertés” n°78-17 du 6 janvier 1978 modifiée et au RGPD,  
          vous disposez d’un droit d’accès, de rectification, d’opposition et de suppression de vos données  
          personnelles ; pour l’exercer, contactez privacy@socialtime.example.com.  
        </p>
        <p>
          <a href="/legal/terms">Conditions Générales d’Utilisation</a> |  
          <a href="/legal/privacy" style={{ marginLeft: '0.5rem' }}>Politique de Confidentialité</a>
        </p>
      </div>
    </footer>
  );
}
