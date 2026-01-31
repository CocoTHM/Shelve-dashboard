import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirige vers le dashboard ou la page de login
  redirect('/dashboard');
}
