// client/src/components/PubCrawlForm.js
import React, { useState } from 'react';

function PubCrawlForm({ onGenerate, onSave, loading }) {
  const [count, setCount] = useState(5);
  const [name, setName] = useState('My Pub Crawl');

  const handleGenerate = e => {
    e.preventDefault();
    onGenerate(Number(count));
  };

  const handleSave = e => {
    e.preventDefault();
    onSave(name);
  };

  return (
    <div className="crawl-controls">
      <form onSubmit={handleGenerate}>
        <label>
          Number of beer spots:
          <input
            type="number"
            min="1"
            max="20"
            value={count}
            onChange={e => setCount(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Finding spots…' : 'Generate Crawl'}
        </button>
      </form>

      <form onSubmit={handleSave} style={{ marginTop: '1rem' }}>
        <label>
          Route name:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <button type="submit">Save Crawl</button>
      </form>
    </div>
  );
}

export default PubCrawlForm;
