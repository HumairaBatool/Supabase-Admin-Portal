import React, { useEffect, useState } from 'react';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update form when selected item changes
  useEffect(() => {
    const selected = contents.find((item) => item.id === Number(selectedId));
    if (selected) {
      setFormValues(selected);
    }
  }, [selectedId, contents]);
  
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues) {
      console.error('No form values to submit');
      return;
    }
    setLoading(true);

    const original = contents.find((item) => item.id === Number(selectedId));
    const now = new Date().toISOString();

    const updates = {
      id:  Number(selectedId),
    };

    if (formValues.title !== original.title) {
      updates.title = formValues.title;
      updates.titleUpdatedAt = now;
    }
    if (formValues.description !== original.description) {
      updates.description = formValues.description;
      updates.descriptionUpdatedAt = now;
    }
    const { error } = await supabase.from('content').update(updates).eq('id',  Number(selectedId));
    if (error) {
      console.error('Update error:', error.message);
    } else {
      await fetchContent();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-purple-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
          Admin Content Manager
        </h2>

        {contents.length > 0 ? (
          <>
            <label className="block mb-2 text-purple-900 font-medium">
              Select Content Record
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full mb-6 p-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-400"
            >
              {contents.map((item) => (
                <option key={item.id} value={item.id}>
                  Content: {item.id}
                </option>
              ))}
            </select>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-purple-300 rounded-md "
                />
                <p className="text-sm text-gray-500 mt-1">
                  Title Last Updated:{' '}
                  {formValues.titleUpdatedAt
                    ? new Date(formValues.titleUpdatedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  value={formValues.description}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-purple-300 rounded-md "
                />
                <p className="text-sm text-gray-500 mt-1">
                  Description Last Updated:{' '}
                  {formValues.descriptionUpdatedAt
                    ? new Date(formValues.descriptionUpdatedAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="bg-red-400 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">No content found in Supabase.</p>
        )}
      </div>
    </div>
  );
};

export default ContentForm;
