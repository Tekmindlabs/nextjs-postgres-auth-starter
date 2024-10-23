import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export function middleware(req) {
  const { user } = supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/protected-page'],
};