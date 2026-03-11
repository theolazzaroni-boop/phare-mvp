import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabase = createClient(
  'https://iagwnupkgrcjmdyoyuwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhZ3dudXBrZ3Jjam1keW95dXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjcyMTQsImV4cCI6MjA4ODg0MzIxNH0.vda2oXUT3hmF7t_VP3oR3Xb2R0s0BQelQQ7bE0Df1eA'
);

const prisma = new PrismaClient();

// Sign up — even if email confirmation is required, we get the user id
const { data, error } = await supabase.auth.signUp({
  email: 'theolazzaroni39@gmail.com',
  password: 'phare1234',
});

if (error && !error.message.includes('already registered')) {
  console.error('Erreur signUp:', error.message);
  process.exit(1);
}

const userId = data?.user?.id;
if (!userId) {
  console.error('Impossible de récupérer l\'id. Vérifiez Supabase Auth > Users.');
  process.exit(1);
}

await prisma.profile.upsert({
  where: { id: userId },
  update: { role: 'ADMIN', name: 'Theo' },
  create: { id: userId, email: 'theolazzaroni39@gmail.com', name: 'Theo', role: 'ADMIN' },
});

console.log('✅ Profil admin créé en base, id:', userId);
console.log('⚠️  Si email confirmation activée sur Supabase, allez dans Authentication > Users et confirmez manuellement.');

await prisma.$disconnect();
