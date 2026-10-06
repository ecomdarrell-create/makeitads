import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Exemple : redirection auth, etc.
  // Le point crucial est le matcher ci-dessous
}

export const config = {
  // Ignore les routes API, les fichiers statiques et les images
  // Cela garantit que /api/generate-strategy n'est JAMAIS bloqué ou modifié par le middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};