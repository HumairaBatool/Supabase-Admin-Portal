import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { TextField, Button, Typography, Box } from '@mui/material';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <Box maxWidth={400} m="auto" p={3}>
      <Typography variant="h5">Login</Typography>
      <TextField fullWidth label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <TextField fullWidth label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>Login</Button>
    </Box>
  );
};

export default Login;
