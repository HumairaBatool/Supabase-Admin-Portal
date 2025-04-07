import React, { useEffect, useState } from 'react';
import { TextField,Button,Box,Typography,Paper,MenuItem,Select,InputLabel,FormControl,} from '@mui/material';
import { supabase } from '../supabase/client';

const ContentForm = () => {
  const [contents, setContents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [formValues, setFormValues] = useState({ id: '', title: '', description: '', titleUpdatedAt: '',  descriptionUpdatedAt: '',});
  const [loading, setLoading] = useState(false);

  // Fetch all content records
  const fetchContent = async () => {
    const { data, error } = await supabase.from('content').select('*');
    if (error) {
      console.error('Error fetching content:', error.message);
    } else {
      setContents(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
        setFormValues(data[0]);
      }
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Update form when selected item changes
  useEffect(() => {
    const selected = contents.find((item) => item.id === selectedId);
    if (selected) {
      setFormValues(selected);
    }
  }, [selectedId, contents]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const original = contents.find((item) => item.id === selectedId);
    const now = new Date().toISOString();

    const updates = {
      id: selectedId,
    };

    if (formValues.title !== original.title) {
      updates.title = formValues.title;
      updates.titleUpdatedAt = now;
    }

    if (formValues.description !== original.description) {
      updates.description = formValues.description;
      updates.descriptionUpdatedAt = now;
    }

    const { error } = await supabase
      .from('content')
      .update(updates)
      .eq('id', selectedId);

    if (error) {
      console.error('Update error:', error.message);
    } else {
      await fetchContent();
    }

    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 700, margin: '2rem auto' }}>
      <Typography variant="h5" gutterBottom>
        Admin Content Manager
      </Typography>

      {contents.length > 0 ? (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Content Record</InputLabel>
            <Select
              value={selectedId}
              label="Select Content Record"
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {contents.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  Content: {item.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              Title Last Updated:{' '}
              {formValues.titleUpdatedAt
                ? new Date(formValues.titleUpdatedAt).toLocaleString()
                : 'N/A'}
            </Typography>

            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formValues.description}
              onChange={handleChange}
              fullWidth
            />
            <Typography variant="body2" color="text.secondary">
              Description Last Updated:{' '}
              {formValues.descriptionUpdatedAt
                ? new Date(formValues.descriptionUpdatedAt).toLocaleString()
                : 'N/A'}
            </Typography>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button onClick={() => supabase.auth.signOut()}>Logout</Button>

          </Box>
        </>
      ) : (
        <Typography>No content found in Supabase.</Typography>
      )}
    </Paper>
  );
};

export default ContentForm;
