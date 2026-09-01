const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-badge--pending';
      case 'In Progress':
        return 'status-badge--in-progress';
      case 'Completed':
        return 'status-badge--completed';
      default:
        return '';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      <span className="status-badge__dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
