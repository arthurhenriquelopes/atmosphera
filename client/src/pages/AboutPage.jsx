import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page page-container">
      <div className="about-card glass-panel">
        <div className="dev-section">
          <h2>developer</h2>
          <p className="dev-name">pm accelerator applicant</p>
          <p className="text-secondary">ai engineer intern assessment</p>
        </div>

        <div className="divider"></div>

        <div className="pm-section">
          <h2>about pm accelerator</h2>
          <p className="pm-desc">
            Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their careers in product management. The accelerator provides mentorship, hands-on experience, and industry connections to empower the next generation of tech leaders and innovators.
          </p>
          <a href="https://www.linkedin.com/company/product-manager-accelerator/" target="_blank" rel="noreferrer" className="btn btn-primary mt-2">
            visit linkedin page
          </a>
        </div>

        <div className="divider"></div>

        <div className="tech-section">
          <h2>tech stack built</h2>
          <div className="tech-tags">
            <span className="tag">react.js</span>
            <span className="tag">vite</span>
            <span className="tag">node.js</span>
            <span className="tag">express.js</span>
            <span className="tag">sqlite</span>
            <span className="tag">prisma</span>
          </div>
        </div>
      </div>
    </div>
  );
}
