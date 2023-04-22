import { useState, useEffect } from 'react';
import { supabase } from '../context/supabaseClient';
import Avatar from './Avatar';
import './Account.css';
import CountryDropdown from './CountryDropdown';

export default function Account({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [country, setCountry] = useState(null);
  const [gender, setGender] = useState(null);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, country, gender`)
        .eq('id', user.id)
        .single();

      if (error) {
        alert(error.message);
        return;
      } else if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setCountry(data.country);
        setGender(data.gender)
      }
      
      setLoading(false);
    }

    getProfile();
  }, [session])

  async function updateProfile(event) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      website,
      avatar_url,
      country, 
      gender,
      updated_at: new Date(),
    }

    let { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
      return;
    }
    alert("Successfully Updated!");
    setLoading(false);
  }

  return (
    <div className="container">
      <div className="account-setting-container container">
        <h2 className='title'>Edit Your Profile!</h2>
        <form onSubmit={updateProfile} className="container">
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(event, url) => {
              setAvatarUrl(url);
              updateProfile(event);
            }}
          />

          <div style={{display: "flex", flexDirection: "column"}}>
            <label htmlFor="email">Email</label>
            <input style={{width: '350px'}} id="email" type="text" value={session.user.email} disabled />
          </div>

          <div style={{display: "flex", flexDirection: "column"}}>
            <label htmlFor="username">Name</label>
            <input
              style={{width: '350px'}}
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column"}}>
            <label htmlFor="website">Website</label>
            <input
              style={{width: '350px'}}
              id="website"
              type="url"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column", width: '70%'}}>
            <label htmlFor="country">Country</label>
            <CountryDropdown country={country || ''} handleChange={(e) => setCountry(e.target.value)}/>
          </div>

          <div className="flex">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              Female
            </label>
          </div>

          <div className="flex">
            <div>
              <button className="updateBtn" type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}