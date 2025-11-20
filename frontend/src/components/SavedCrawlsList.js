// client/src/components/SavedCrawlsList.js
import React from 'react';

function SavedCrawlsList({ crawls, onSelect, onDelete }) {
  if (!crawls.length) {
    return <p>You don’t have any saved crawls yet.</p>;
  }

  return (
    <div>
      <h3>My Saved Routes</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {crawls.map(crawl => (
          <li
            key={crawl._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '0.5rem 0.5rem 0.5rem 0.75rem',
              marginBottom: '0.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Clickable area to load crawl */}
            <div
              style={{ cursor: 'pointer', flex: 1, marginRight: '0.5rem' }}
              onClick={() => onSelect && onSelect(crawl)}
            >
              <strong>{crawl.name}</strong>
              <br />
              <small>
                {crawl.stops?.length || 0} stops •{' '}
                {new Date(crawl.createdAt).toLocaleString()}
              </small>
            </div>

            {/* X button to delete */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation(); // don’t trigger onSelect
                onDelete && onDelete(crawl._id);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#c00',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
              aria-label={`Delete crawl ${crawl.name}`}
              title="Delete this route"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedCrawlsList;
