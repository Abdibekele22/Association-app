import React from 'react';

export function BarChart({ labels, datasets }) {
  return (
    <div className="p-4 border rounded text-center text-gray-500">
      [BarChart Placeholder]
      <br />
      Labels: {labels.join(', ')}
    </div>
  );
}

export function LineChart({ labels, datasets }) {
  return (
    <div className="p-4 border rounded text-center text-gray-500">
      [LineChart Placeholder]
      <br />
      Labels: {labels.join(', ')}
    </div>
  );
}
