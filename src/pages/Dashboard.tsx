import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { logout } from '../App';
import { api } from '../api';
import styles from './Dashboard.module.css';

interface JobSummary {
  id: string;
  status: string;
  currentStep: number | null;
  errorMessage: string | null;
  proxy: string | null;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email?: string;
}

interface JobsResponse {
  ok: boolean;
  jobs: JobSummary[];
  pagination: { page: number; limit: number; total: number };
}

const STATUS_OPTIONS = ['', 'queued', 'running', 'completed', 'failed', 'dry_run_completed'];

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') ?? '1', 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    params.set('page', String(page));
    params.set('limit', '20');

    api<JobsResponse>(`/admin/jobs?${params}`)
      .then((data) => {
        if (!cancelled) {
          setJobs(data.jobs);
          setPagination(data.pagination);
        }
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [statusFilter, page]);

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bot Credit</h1>
        <nav className={styles.nav}>
          <Link to="/dashboard" className={styles.navActive}>Заявки</Link>
          <Link to="/proxies" className={styles.navLink}>Прокси</Link>
        </nav>
        <button type="button" onClick={logout} className={styles.logout}>
          Logout
        </button>
      </header>
      <main className={styles.main}>
        <div className={styles.toolbar}>
          <h2 className={styles.subtitle}>Заявки</h2>
          <div className={styles.filters}>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className={styles.select}
            >
              <option value="">Все статусы</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : jobs.length === 0 ? (
          <div className={styles.empty}>Нет заявок</div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Статус</th>
                  <th>Шаг</th>
                  <th>Прокси</th>
                  <th>Создан</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td className={styles.mono}>{j.id.slice(0, 8)}…</td>
                    <td>{j.phone ?? '—'}</td>
                    <td>{j.email ?? '—'}</td>
                    <td>
                      <span className={styles[`status_${j.status}`] ?? styles.status}>{j.status}</span>
                    </td>
                    <td>{j.currentStep ?? '—'}</td>
                    <td className={styles.proxy}>{j.proxy ?? '—'}</td>
                    <td>{new Date(j.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.btn}
                        onClick={() => navigate(`/jobs/${j.id}`)}
                      >
                        Открыть
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ←
                </button>
                <span>{page} / {totalPages}</span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
