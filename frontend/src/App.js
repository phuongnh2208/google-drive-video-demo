import './App.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('appToken'));
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  // Khởi tạo Google Identity
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      setGoogleReady(true);
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!googleReady || !googleButtonRef.current) {
      return;
    }

    googleButtonRef.current.innerHTML = '';

    if (!token) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
      });
    }
  }, [googleReady, token]);

  const loadPublicVideos = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/videos/public`);
      setVideos(data);
    } catch {}
  }, []);

  const loadCurrentUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const { data } = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data);
    } catch {
      localStorage.removeItem('appToken');
      setToken(null);
      setUser(null);
    }
  }, [token]);

  const loadAllVideos = useCallback(async () => {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const results = [];

    try {
      const { data } = await axios.get(`${API}/videos/public`);
      results.push(...data);
    } catch {}

    if (token) {
      try {
        const { data } = await axios.get(`${API}/videos/private`, { headers });
        results.push(...data);
      } catch {}

      try {
        const { data } = await axios.get(`${API}/videos/allowed`, { headers });
        results.push(...data);
      } catch {}
    }

    setVideos(results);
    setLoading(false);
  }, [token]);

  // Nếu đã có token thì load video ngay
  useEffect(() => {
    if (token) loadAllVideos();
    else loadPublicVideos();
  }, [token, loadAllVideos, loadPublicVideos]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function handleGoogleLogin(response) {
    try {
      const { data } = await axios.post(`${API}/auth/google-login`, {
        idToken: response.credential,
      });
      localStorage.setItem('appToken', data.accessToken);
      setToken(data.accessToken);
      setUser(data.user);
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
      }
      setMessage('');
    } catch (err) {
      setMessage('Đăng nhập thất bại!');
    }
  }

  function logout() {
    localStorage.removeItem('appToken');
    setToken(null);
    setUser(null);
    setVideos([]);
    setActiveVideoId(null);
    setLoading(false);
    loadPublicVideos();
    window.google?.accounts.id.disableAutoSelect();
  }

  return (
    <div className="app">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <header className="header">
        <div className="brand-block">
          <span className="eyebrow">Google Drive Video Demo</span>
          <h1>Hệ thống xem video</h1>
        </div>

        <div className="header-actions">
          {token ? (
            <div className="user-info">
              {user ? (
                <img src={user.picture} alt="avatar" className="avatar" />
              ) : (
                <div className="avatar avatar-placeholder">?</div>
              )}
              <div className="user-copy">
                <span className="user-name">{user?.name ?? 'Đang xác thực...'}</span>
                <span className="user-email">
                  {user ? 'Đã đăng nhập' : 'Đang xác thực phiên'}
                </span>
              </div>
              <button className="btn-logout" onClick={logout}>Đăng xuất</button>
            </div>
          ) : (
            <div className="auth-card">
              <span className="auth-label">Đăng nhập để mở khóa video riêng</span>
              <div ref={googleButtonRef} />
            </div>
          )}
        </div>
      </header>

      {message && <div className="message">{message}</div>}

      {!token && (
        <div className="notice">
          Đăng nhập để xem thêm video Private và Allowed
        </div>
      )}

      {loading ? (
        <div className="loading-panel">Đang tải video...</div>
      ) : (
        <div className="video-feed">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={activeVideoId === video.id}
              onToggle={() => setActiveVideoId(
                activeVideoId === video.id ? null : video.id,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VideoCard({ video, isActive, onToggle }) {

  const labelColor = {
    PUBLIC: '#4caf50',
    PRIVATE: '#2196f3',
    ALLOWED: '#ff9800',
  }[video.accessLevel] ?? '#999';

  return (
    <article className="video-card">
      <div className="video-card-top">
        <div className="video-label" style={{ backgroundColor: labelColor }}>
          {video.accessLevel}
        </div>
        <div className="video-meta">
          <span>Video #{video.id}</span>
          <span>Google Drive</span>
        </div>
      </div>

      <h3 className="video-title">{video.title}</h3>

      {isActive ? (
        <iframe
          className="video-frame"
          src={video.embedUrl}
          width="100%"
          height="360"
          allow="autoplay"
          allowFullScreen
          title={video.title}
        />
      ) : (
        <button className="video-thumb" onClick={onToggle} type="button">
          <span className="play-icon">▶</span>
          <span>Nhấn để xem video</span>
        </button>
      )}

      <div className="video-card-footer">
        <span>Chế độ xem dọc</span>
        <button className="link-button" onClick={onToggle} type="button">
          {isActive ? 'Thu gọn' : 'Mở video'}
        </button>
      </div>
    </article>
  );
}

export default App;