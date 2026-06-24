import { useEffect, useState } from 'react';
import { recordsService, exportService } from '../services/api';
import './HistoryPage.css';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // simple editing state
  const [editingId, setEditingId] = useState(null);
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await recordsService.getAll();
      setRecords(data);
    } catch (err) {
      setError('failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('are you sure you want to delete this record?')) return;
    try {
      await recordsService.delete(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      alert('failed to delete');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditDesc(record.description || '');
  };

  const handleSave = async (id) => {
    try {
      const updated = await recordsService.update(id, { description: editDesc });
      setRecords(records.map(r => r.id === id ? updated : r));
      setEditingId(null);
    } catch (err) {
      alert('failed to update');
    }
  };

  if (loading) return <div className="page-container loader">loading history...</div>;

  return (
    <div className="history-page page-container">
      <header className="page-header">
        <h1>search history</h1>
        <p className="subtitle">view, edit, and export your weather search records.</p>
      </header>

      {error && <div className="error-message glass-panel">{error}</div>}

      <div className="export-panel glass-panel">
        <h3>export data</h3>
        <p className="text-secondary mb-1">download your records in various formats</p>
        <div className="export-buttons">
          <a href={exportService.getDownloadUrl('json')} className="btn btn-glass" download>JSON</a>
          <a href={exportService.getDownloadUrl('csv')} className="btn btn-glass" download>CSV</a>
          <a href={exportService.getDownloadUrl('xml')} className="btn btn-glass" download>XML</a>
          <a href={exportService.getDownloadUrl('markdown')} className="btn btn-glass" download>MD</a>
          <a href={exportService.getDownloadUrl('pdf')} className="btn btn-glass" target="_blank" rel="noreferrer">PDF</a>
        </div>
      </div>

      <div className="records-table-container glass-panel">
        {records.length === 0 ? (
          <p className="text-center text-secondary">no records found. go search for some cities!</p>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>location</th>
                <th>date</th>
                <th>temp</th>
                <th>description</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map(record => (
                <tr key={record.id}>
                  <td>{record.location}</td>
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td>{record.temperature}°C</td>
                  <td>
                    {editingId === record.id ? (
                      <input 
                        type="text" 
                        className="input-field edit-input"
                        value={editDesc} 
                        onChange={(e) => setEditDesc(e.target.value)} 
                      />
                    ) : (
                      record.description
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingId === record.id ? (
                      <>
                        <button className="btn-icon text-success" onClick={() => handleSave(record.id)}>💾</button>
                        <button className="btn-icon" onClick={() => setEditingId(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button className="btn-icon" onClick={() => handleEdit(record)} title="edit description">✏️</button>
                        <button className="btn-icon text-danger" onClick={() => handleDelete(record.id)} title="delete">🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
