import React, { useEffect, useState } from 'react';
import ContentForm from './components/ContentForm';
import Login from './components/Login';
import { supabase } from './supabase/client';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return session ? <ContentForm /> : <Login onLogin={() => supabase.auth.getSession().then(({ data: { session } }) => setSession(session))} />;
};

export default App;
