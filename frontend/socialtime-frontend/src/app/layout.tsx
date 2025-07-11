// src/app/layout.tsx
import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'SocialTime',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          <div className="app-container">
            <Sidebar />
            <main className="app-main">{children}</main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
