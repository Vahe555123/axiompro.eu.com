import { useState, useEffect } from 'react';
import { artifactUrl } from '../api';

interface Props {
  runId: string;
  index: number;
  alt?: string;
  style?: React.CSSProperties;
}

export function ScreenshotImage({ runId, index, alt, style }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    const token = sessionStorage.getItem('admin_token');
    fetch(artifactUrl(runId, index), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => setError('Failed to load image'));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [runId, index]);

  if (error) return <span style={{ color: '#c00' }}>{error}</span>;
  if (!src) return <span style={{ color: '#888' }}>Loading...</span>;
  return <img src={src} alt={alt ?? 'Screenshot'} style={{ maxWidth: '100%', ...style }} />;
}
