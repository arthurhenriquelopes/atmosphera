import React from 'react';
import './Skeleton.css';

export default function WeatherCardSkeleton() {
  return (
    <div className="weather-card glass-panel skeleton-wrapper">
      <div className="weather-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
      
      <div className="weather-body">
        <div className="weather-main">
          <div className="skeleton skeleton-icon"></div>
          <div className="temperature">
            <div className="skeleton skeleton-temp"></div>
          </div>
        </div>
        
        <div className="weather-details">
          {[1, 2, 3].map(i => (
            <div className="detail-item" key={i}>
              <div className="skeleton skeleton-label"></div>
              <div className="skeleton skeleton-value"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
