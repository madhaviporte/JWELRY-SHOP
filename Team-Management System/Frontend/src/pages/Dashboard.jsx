import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { membersAPI, tasksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [membersRes, tasksRes] = await Promise.all([
          membersAPI.getAll(),
          tasksAPI.getAll(),
        ]);

        const tasks = tasksRes.data.data;
        const pending = tasks.filter((t) => t.status === 'Pending').length;
        const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
        const completed = tasks.filter((t) => t.status === 'Completed').length;

        setStats({
          totalMembers: membersRes.data.count,
          totalTasks: tasksRes.data.count,
          pendingTasks: pending,
          inProgressTasks: inProgress,
          completedTasks: completed,
        });

        setRecentTasks(tasks.slice(0, 5));
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading loading--full">
        <div className="loading__spinner"></div>
        <p className="loading__text">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <p className="empty-state__text" style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
      </div>

      <div className="dashboard__stats">
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-card-icon dashboard__stat-card-icon--purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="dashboard__stat-card-value">{stats.totalMembers}</div>
          <div className="dashboard__stat-card-label">Team Members</div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-card-icon dashboard__stat-card-icon--blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="dashboard__stat-card-value">{stats.totalTasks}</div>
          <div className="dashboard__stat-card-label">Total Tasks</div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-card-icon dashboard__stat-card-icon--yellow">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="dashboard__stat-card-value">{stats.pendingTasks}</div>
          <div className="dashboard__stat-card-label">Pending Tasks</div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-card-icon dashboard__stat-card-icon--blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="dashboard__stat-card-value">{stats.inProgressTasks}</div>
          <div className="dashboard__stat-card-label">In Progress</div>
        </div>

        <div className="dashboard__stat-card">
          <div className="dashboard__stat-card-icon dashboard__stat-card-icon--green">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="dashboard__stat-card-value">{stats.completedTasks}</div>
          <div className="dashboard__stat-card-label">Completed</div>
        </div>
      </div>

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2>Recent Tasks</h2>
          <Link to="/tasks" className="btn btn--outline btn--sm">View All</Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state__text">No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div className="dashboard__task-list">
            {recentTasks.map((task) => (
              <div key={task._id} className="dashboard__task-item">
                <div className="dashboard__task-info">
                  <div className="dashboard__task-info-title">{task.title}</div>
                  <div className="dashboard__task-info-meta">
                    Assigned to {task.assignedTo?.name || 'Unknown'} · Due {formatDate(task.dueDate)}
                  </div>
                </div>
                <StatusBadge status={task.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
