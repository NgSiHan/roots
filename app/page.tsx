import { redirect } from 'next/navigation';

/**
 * Root page - redirects to /tree
 */
export default function Home() {
  redirect('/tree');
}
