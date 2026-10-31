import React from 'react';

/**
 * Nettoie tous les patterns markdown résiduels.
 * Ne touche PAS aux `**mot**` (gérés séparément dans renderRichText).
 */
export function cleanMarkdown(text: string): string {
  if (!text) return '';

  return (
    text
      // 1. Gras+italiques ***mot*** → mot (astérisques retirés)
      .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
      // 2. Italiques *mot* → mot
      .replace(/(?<!\*)\*(?!\*)([^*\n]+?)\*(?!\*)/g, '$1')
      // 3. Italiques _mot_ → mot
      .replace(/(?<!\w)_([^_\n]+?)_(?!\w)/g, '$1')
      // 4. Astérisques résiduels isolés
      .replace(/\*/g, '')
      // 5. Underscores résiduels isolés
      .replace(/(?<!\w)_(?!\w)/g, '')
      // 6. Backticks résiduels
      .replace(/`/g, '')
      // 7. Dièses markdown en début de ligne
      .replace(/^#{1,6}\s+/gm, '')
  );
}

/**
 * Rend le texte riche : les **mot** deviennent du gras violet,
 * tout le reste est nettoyé des astérisques.
 *
 * Utilisation : renderRichText(monTexte)
 * Retourne un ReactNode prêt à afficher.
 */
export function renderRichText(text: string): React.ReactNode {
  if (!text) return null;

  // Normaliser ***mot*** → **mot** pour que le gras soit prioritaire
  const normalized = text.replace(/\*\*\*([^*]+)\*\*\*/g, '**$1**');

  const lines = normalized.split('\n');

  return lines.map((line, lineIdx) => {
    // Split sur les patterns **mot** en préservant les délimiteurs
    const parts = line.split(/(\*\*[^*]+\*\*)/g);

    return (
      <React.Fragment key={lineIdx}>
        {parts.map((part, i) => {
          // Mot clé en gras violet (**mot**)
          if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
            const innerText = cleanMarkdown(part.slice(2, -2));
            if (!innerText) return null;
            return (
              <strong key={i} className="font-bold text-[#8B5CF6]">
                {innerText}
              </strong>
            );
          }
          // Texte normal : nettoyer les astérisques résiduels
          const cleaned = cleanMarkdown(part);
          if (!cleaned) return null;
          return <span key={i}>{cleaned}</span>;
        })}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}