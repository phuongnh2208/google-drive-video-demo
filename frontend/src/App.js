import './App.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const ACCESS_LABELS = {
  PUBLIC: { text: 'PUBLIC', color: '#4caf50' },
  PRIVATE: { text: 'PRIVATE', color: '#2196f3' },
  ALLOWED: { text: 'ALLOWED', color: '#ff9800' },
};

const CLASS_LABELS = {
  CLASS_A: 'Lớp A',
  CLASS_B: 'Lớp B',
};

function getApiErrorMessage(error, fallback) {
  return error?.response?.data?.message ?? fallback;
}

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('appToken'));
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const googleButtonRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

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
    } catch {
      setVideos([]);
    }
  }, []);

  const loadVideosForUser = useCallback(async (currentUser, authToken) => {
    setLoading(true);
    setActiveVideoId(null);
    const headers = { Authorization: `Bearer ${authToken}` };
    const results = [];

    try {
      const { data } = await axios.get(`${API}/videos/public`);
      results.push(...data);
    } catch {
      /* optional */
    }

    try {
      const { data } = await axios.get(`${API}/videos/private`, { headers });
      results.push(...data);
    } catch (error) {
      if (error?.response?.status !== 404) {
        setMessage({
          type: 'error',
          text: getApiErrorMessage(error, 'Không thể tải video PRIVATE.'),
        });
      }
    }

    if (currentUser?.videoClass) {
      try {
        const { data } = await axios.get(`${API}/videos/allowed`, { headers });
        results.push(...data);
      } catch (error) {
        const status = error?.response?.status;
        if (status !== 404) {
          setMessage({
            type: 'error',
            text: getApiErrorMessage(
              error,
              'Không thể tải video ALLOWED của lớp bạn.',
            ),
          });
        }
      }
    }

    setVideos(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      loadPublicVideos();
      return;
    }

    let cancelled = false;

    async function bootstrapSession() {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        setUser(data);
        await loadVideosForUser(data, token);
      } catch {
        if (cancelled) return;
        localStorage.removeItem('appToken');
        setToken(null);
        setUser(null);
        await loadPublicVideos();
      }
    }

    bootstrapSession();
    return () => {
      cancelled = true;
    };
  }, [token, loadPublicVideos, loadVideosForUser]);

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

      const allowedNotice = data.user.videoClass
        ? ` Bạn được phép xem video ALLOWED của ${CLASS_LABELS[data.user.videoClass]}.`
        : ' Bạn chưa có quyền ALLOWED — chỉ xem PUBLIC và PRIVATE.';

      setMessage({
        type: 'success',
        text: `Bạn đã đăng nhập bằng mail: ${data.user.email}.${allowedNotice} Đảm bảo Google Drive trên trình duyệt cũng đang đăng nhập bằng email này.`,
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: getApiErrorMessage(err, 'Đăng nhập thất bại!'),
      });
    }
  }

  function logout() {
    localStorage.removeItem('appToken');
    setToken(null);
    setUser(null);
    setVideos([]);
    setActiveVideoId(null);
    setMessage(null);
    setLoading(false);
    loadPublicVideos();
    window.google?.accounts.id.disableAutoSelect();
  }

  const membershipLabel = user?.videoClass
    ? `ALLOWED — ${CLASS_LABELS[user.videoClass]}`
    : 'Chưa có quyền ALLOWED';

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
                <span className="user-email">{user?.email ?? 'Đang xác thực phiên'}</span>
                <span className="user-class">{membershipLabel}</span>
              </div>
              <button className="btn-logout" onClick={logout}>Đăng xuất</button>
            </div>
          ) : (
            <div className="auth-card">
              <span className="auth-label">Đăng nhập Google để xem thêm video PRIVATE và ALLOWED</span>
              <div ref={googleButtonRef} />
            </div>
          )}
        </div>
      </header>

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      {!token && (
        <div className="notice">
          Cấp 1 — PUBLIC: xem không cần đăng nhập. Đăng nhập để xem PRIVATE và ALLOWED.
        </div>
      )}

      {token && user && !user.videoClass && (
        <div className="notice notice-warning">
          Bạn đang xem <strong>PUBLIC</strong> và <strong>PRIVATE</strong>.
          Email <strong>{user.email}</strong> chưa được cấp quyền <strong>ALLOWED</strong>.
        </div>
      )}

      {token && user?.videoClass && (
        <div className="notice notice-info">
          Bạn thuộc whitelist <strong>{CLASS_LABELS[user.videoClass]}</strong>.
          {' '}Video ALLOWED chỉ lấy từ thư mục Drive tương ứng — quyền xem do Google Drive cấp.
          {' '}Hãy đảm bảo Drive trên trình duyệt đang dùng <strong>{user.email}</strong>.
        </div>
      )}

      {loading ? (
        <div className="loading-panel">Đang tải video...</div>
      ) : videos.length === 0 ? (
        <div className="loading-panel">Không có video nào để hiển thị.</div>
      ) : (
        <div className="video-feed">
          {videos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              isActive={activeVideoId === video.id}
              canPlay={Boolean(video.embedUrl)}
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

function VideoCard({ video, isActive, canPlay, onToggle }) {
  const label = ACCESS_LABELS[video.accessLevel] ?? {
    text: video.accessLevel,
    color: '#999',
  };

  return (
    <article className="video-card">
      <div className="video-card-top">
        <div className="video-label" style={{ backgroundColor: label.color }}>
          {label.text}
        </div>
        <div className="video-meta">
          <span>Video #{video.id}</span>
          <span>Google Drive</span>
        </div>
      </div>

      <h3 className="video-title">{video.title}</h3>

      {!canPlay ? (
        <div className="video-blocked">
          Bạn không có quyền xem video này.
        </div>
      ) : isActive ? (
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
        <span>{label.text}</span>
        {canPlay && (
          <button className="link-button" onClick={onToggle} type="button">
            {isActive ? 'Thu gọn' : 'Mở video'}
          </button>
        )}
      </div>
    </article>
  );
}

export default App;
