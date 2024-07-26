function UserStatus() {
  return (
    <div className="stats bg-primary text-primary-content">
      <div className="stat">
        <div className="stat-title">Amount Donated</div>
        <div className="stat-value">2 Units</div>
        <div className="stat-actions">
          <button className="btn btn-sm btn-success">See global stat</button>
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">
          People Benefited from your contribution
        </div>
        <div className="stat-value">100</div>
        <div className="stat-actions">
          <progress className="progress progress-primary w-56"></progress>
        </div>
      </div>
    </div>
  );
}

export default UserStatus;
