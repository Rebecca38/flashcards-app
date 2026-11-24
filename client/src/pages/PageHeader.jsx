import './PageHeader.css';

function PageHeader({ eyebrow, title, subtitle, badge, actions }) {
  return (
    <header className="page-header">
      <div className="page-header-text">
        <p className="page-eyebrow">{eyebrow}</p>
        <div className="page-title-row">
          <h1 className="page-title">{title}</h1>
          {badge && <span className="page-badge">{badge}</span>}
        </div>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export default PageHeader;