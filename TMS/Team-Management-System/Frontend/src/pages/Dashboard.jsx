import { useState, useEffect } from 'react';
import { membersAPI, tasksAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [membersResponse, tasksResponse] = await Promise.all([
        membersAPI.getAll(),
        tasksAPI.getAll()
      ]);

      const members = membersResponse.data.data;
      const tasks = tasksResponse.data.data;

      setStats({
        totalMembers: members.length,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter((task) => task.status === 'Pending').length,
        inProgressTasks: tasks.filter((task) => task.status === 'In Progress').length,
        completedTasks: tasks.filter((task) => task.status === 'Completed').length
      });

      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Dashboard</h1>
        <p className="dashboard__subtitle">Overview of your team and tasks</p>
      </div>

      <div className="dashboard__stats">
        <div className="dashboard__card">
          <div className="dashboard__card-icon dashboard__card-icon--primary">
            👥
          </div>
          <div className="dashboard__card-value">{stats.totalMembers}</div>
          <div className="dashboard__card-label">Team Members</div>
        </div>
        <div className="dashboard__card">
          <div className="dashboard__card-icon dashboard__card-icon--info">
            📋
          </div>
          <div className="dashboard__card-value">{stats.totalTasks}</div>
          <div className="dashboard__card-label">Total Tasks</div>
        </div>
        <div className="dashboard__card">
          <div className="dashboard__card-icon dashboard__card-icon--warning">
            ⏳
          </div>
          <div className="dashboard__card-value">{stats.pendingTasks}</div>
          <div className="dashboard__card-label">Pending Tasks</div>
        </div>
        <div className="dashboard__card">
          <div className="dashboard__card-icon dashboard__card-icon--primary">
            🔄
          </div>
          <div className="dashboard__card-value">{stats.inProgressTasks}</div>
          <div className="dashboard__card-label">In Progress</div>
        </div>
        <div className="dashboard__card">
          <div className="dashboard__card-icon dashboard__card-icon--success">
            ✅
          </div>
          <div className="dashboard__card-value">{stats.completedTasks}</div>
          <div className="dashboard__card-label">Completed</div>
        </div>
      </div>

      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Recent Tasks</h2>
        <div className="dashboard__recent-tasks">
          {recentTasks.length === 0 ? (
            <p className="dashboard__empty-text">No tasks found.</p>
          ) : (
            recentTasks.map((task) => (
              <div key={task._id} className="dashboard__task-item">
                <div className="dashboard__task-info">
                  <span className="dashboard__task-title">{task.title}</span>
                  <span className="dashboard__task-meta">
                    Assigned to: {task.assignedTo?.name || 'N/A'} • Due:{' '}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <StatusBadge value={task.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
