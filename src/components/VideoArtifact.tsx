import { useEffect, useState } from 'react';
import { artifactByIdUrl } from '../api';

interface Props {
  artifactId: string;
}

export function VideoArtifact({ artifactId }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    const token = sessionStorage.getItem('admin_token');

    fetch(artifactByIdUrl(artifactId), {
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
      .catch(() => setError('Failed to load video'));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [artifactId]);

  if (error) return <span style={{ color: '#c00' }}>{error}</span>;
  if (!src) return <span style={{ color: '#888' }}>Loading...</span>;

  return <video src={src} controls preload="metadata" style={{ width: '100%', borderRadius: 8 }} />;
}
