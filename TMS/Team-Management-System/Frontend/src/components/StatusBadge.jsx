const StatusBadge = ({ value }) => {
  const getBadgeClass = () => {
    switch (value) {
      case 'Pending':
        return 'status-badge--pending';
      case 'In Progress':
        return 'status-badge--in-progress';
      case 'Completed':
        return 'status-badge--completed';
      case 'Low':
        return 'status-badge--low';
      case 'Medium':
        return 'status-badge--medium';
      case 'High':
        return 'status-badge--high';
      default:
        return '';
    }
  };

  return (
    <span className={`status-badge ${getBadgeClass()}`}>
      {value}
    </span>
  );
};

export default StatusBadge;
