
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-12 md:py-20 px-6 text-center bg-gradient-to-b from-secondary to-primary border-b border-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-highlight">
          LES 100 EXERCICES SEIRUL-LO
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-textMuted mb-8">
          Classification Intégrale des Situations Simulatrices Préférentielles (SSP)
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Base de données interactive des <strong>100 exercices</strong> de la méthodologie Seirul-lo, 
          classés par niveau de spécificité (NE). Calibrez vos séances avec précision tactique.
        </p>
      </div>
    </header>
  );
};

export default Header;
