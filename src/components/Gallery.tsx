import React, { useEffect, useRef, useState } from 'react';
import { Camera, Lock, LogOut, Upload, Trash2, X, Play, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface MediaItem {
  id: string;
  file: string;
  src?: string;
  type: 'photo' | 'video';
  caption: string;
  trip: string;
  uploadedAt: string;
  featured?: boolean;
}

const FEATURED_MEDIA: MediaItem[] = [
  {
    id: 'featured-8498',
    file: 'traveller-8498.mp4',
    src: '/gallery/traveller-8498.mp4',
    type: 'video',
    caption: 'Travellers together by the river',
    trip: 'Mountain trip',
    uploadedAt: '2026-10-10T12:04:42.000Z',
    featured: true,
  },
  {
    id: 'featured-8499',
    file: 'traveller-8499.mp4',
    src: '/gallery/traveller-8499.mp4',
    type: 'video',
    caption: 'A moment from the mountain trip',
    trip: 'Mountain trip',
    uploadedAt: '2026-10-10T12:08:33.000Z',
    featured: true,
  },
];

type Filter = 'all' | 'photo' | 'video';

const TOKEN_KEY = 'skype_admin_token';
const getStoredToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

const mediaUrl = (item: MediaItem) => item.src || `/uploads/${item.file}`;

export const Gallery: React.FC = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [viewer, setViewer] = useState<number | null>(null);

  const [token, setToken] = useState(getStoredToken);
  const [loginOpen, setLoginOpen] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [files, setFiles] = useState<File[]>([]);
  const [trip, setTrip] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const isAdmin = Boolean(token);
  const visible = items.filter((i) => filter === 'all' || i.type === filter);

  const load = async () => {
    try {
      const res = await fetch('/api/gallery');
      const remote: MediaItem[] = res.ok ? await res.json() : [];
      const remoteIds = new Set(remote.map((item) => item.id));
      setItems([...FEATURED_MEDIA.filter((item) => !remoteIds.has(item.id)), ...remote]);
    } catch {
      setItems(FEATURED_MEDIA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (window.location.hash === '#admin') setLoginOpen(true);
  }, []);

  const saveToken = (t: string) => {
    setToken(t);
    try {
      t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed');
      saveToken(data.token);
      setLoginOpen(false);
      setCreds({ username: '', password: '' });
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const authFetch = async (url: string, init: RequestInit) => {
    const res = await fetch(url, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` } });
    if (res.status === 401) {
      saveToken('');
      setLoginOpen(true);
      throw new Error('Session expired. Please log in again.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    setUploading(true);
    setUploadMsg('');
    const body = new FormData();
    files.forEach((f) => body.append('files', f));
    body.append('trip', trip);
    body.append('caption', caption);
    try {
      const added = await authFetch('/api/gallery', { method: 'POST', body });
      setUploadMsg(`${added.length} file(s) uploaded successfully.`);
      setFiles([]);
      setCaption('');
      if (fileInput.current) fileInput.current.value = '';
      load();
    } catch (err: any) {
      setUploadMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm('Delete this item from the gallery?')) return;
    try {
      await authFetch(`/api/gallery/${item.id}`, { method: 'DELETE' });
      setItems((list) => list.filter((i) => i.id !== item.id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Keyboard navigation for the viewer
  useEffect(() => {
    if (viewer === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewer(null);
      if (e.key === 'ArrowRight') setViewer((v) => (v === null ? v : (v + 1) % visible.length));
      if (e.key === 'ArrowLeft') setViewer((v) => (v === null ? v : (v - 1 + visible.length) % visible.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewer, visible.length]);

  const inputCls =
    'w-full bg-white border border-stone-300 focus:border-amber-600 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-colors';
  const current = viewer !== null ? visible[viewer] : null;

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-t border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">
              <Camera className="w-4 h-4" />
              <span>Trip Gallery</span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Moments From Our Travellers
            </h2>
            <p className="text-stone-600 text-sm md:text-base mt-2 max-w-2xl font-light">
              Photos and videos from the trips we've organised for our happy customers.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['all', 'photo', 'video'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors cursor-pointer ${
                  filter === f ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'bg-white text-stone-700 border-stone-300 hover:bg-amber-50'
                }`}
              >
                {f === 'all' ? 'All' : f === 'photo' ? 'Photos' : 'Videos'}
              </button>
            ))}
            {isAdmin ? (
              <button
                onClick={() => saveToken('')}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-400" /> Admin Logout
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-amber-50 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin
              </button>
            )}
          </div>
        </div>

        {/* Admin upload panel */}
        {isAdmin && (
          <form onSubmit={handleUpload} className="mb-10 rounded-2xl bg-[#fbf9f6] border border-amber-200 p-6 space-y-4">
            <h3 className="text-sm font-serif font-semibold text-amber-800 flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Photos & Videos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input value={trip} onChange={(e) => setTrip(e.target.value)} placeholder="Trip / destination (e.g. Kerala, Dubai)" className={inputCls} />
              <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className={inputCls} />
              <input
                ref={fileInput}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="text-xs text-stone-600 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-stone-200 file:text-stone-800 file:cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Uploading…' : `Upload ${files.length || ''} file(s)`}
              </button>
              <span className="text-xs text-zinc-500">JPG, PNG, WEBP, GIF, MP4, WEBM, MOV · up to 200 MB each, 20 at a time</span>
              {uploadMsg && <span className="text-xs text-amber-300">{uploadMsg}</span>}
            </div>
          </form>
        )}

        {/* Gallery grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center text-stone-500 rounded-2xl border border-dashed border-stone-300 bg-[#fbf9f6]">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 text-stone-400" />
            <p className="text-sm">No {filter === 'all' ? 'photos or videos' : `${filter}s`} yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visible.map((item, idx) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer"
                onClick={() => setViewer(idx)}
              >
                {item.type === 'photo' ? (
                  <img src={mediaUrl(item)} alt={item.caption || item.trip || 'Trip photo'} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <>
                    <video src={`${mediaUrl(item)}#t=0.5`} preload="metadata" muted playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-zinc-950/70 border border-amber-400/50 flex items-center justify-center">
                        <Play className="w-5 h-5 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                  </>
                )}
                {(item.trip || item.caption) && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-zinc-950/90 to-transparent">
                    {item.trip && <p className="text-xs font-semibold text-amber-300">{item.trip}</p>}
                    {item.caption && <p className="text-[11px] text-zinc-300 line-clamp-1">{item.caption}</p>}
                  </div>
                )}
                {isAdmin && !item.featured && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                    aria-label="Delete"
                    className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Viewer */}
      {current && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setViewer(null)}>
          <button className="absolute top-4 right-4 text-zinc-300 hover:text-white cursor-pointer" aria-label="Close">
            <X className="w-7 h-7" />
          </button>
          {visible.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewer((viewer! - 1 + visible.length) % visible.length);
                }}
                className="absolute left-2 md:left-6 text-zinc-300 hover:text-white cursor-pointer"
              >
                <ChevronLeft className="w-9 h-9" />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  setViewer((viewer! + 1) % visible.length);
                }}
                className="absolute right-2 md:right-6 text-zinc-300 hover:text-white cursor-pointer"
              >
                <ChevronRight className="w-9 h-9" />
              </button>
            </>
          )}
          <div className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {current.type === 'photo' ? (
              <img src={mediaUrl(current)} alt={current.caption} className="max-h-[80vh] max-w-full object-contain rounded-lg" />
            ) : (
              <video key={current.id} src={mediaUrl(current)} controls autoPlay playsInline className="max-h-[80vh] max-w-full rounded-lg" />
            )}
            {(current.trip || current.caption) && (
              <p className="mt-3 text-sm text-zinc-300 text-center">
                {current.trip && <span className="text-amber-300 font-semibold">{current.trip}</span>}
                {current.trip && current.caption && ' · '}
                {current.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Admin login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setLoginOpen(false)}>
          <form
            onSubmit={handleLogin}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-white border border-stone-200 shadow-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Admin Login
              </h3>
              <button type="button" onClick={() => setLoginOpen(false)} className="text-stone-400 hover:text-stone-900 cursor-pointer" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              required
              autoFocus
              autoComplete="username"
              placeholder="Username"
              value={creds.username}
              onChange={(e) => setCreds((c) => ({ ...c, username: e.target.value }))}
              className={inputCls}
            />
            <input
              required
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              value={creds.password}
              onChange={(e) => setCreds((c) => ({ ...c, password: e.target.value }))}
              className={inputCls}
            />
            {loginError && <p className="text-xs text-rose-400">{loginError}</p>}
            <button type="submit" className="w-full py-2.5 text-sm font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer">
              Login
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
