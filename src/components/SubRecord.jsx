import React, { useState, useEffect } from 'react';
import { calculateVolume } from '../utils';

const SubRecord = ({ subRecord, index, onUpdate, onRemove }) => {
  const [description, setDescription] = useState(subRecord.description || '');
  const [number, setNumber] = useState(subRecord.number || 0);
  const [length, setLength] = useState(subRecord.length || 0);
  const [width, setWidth] = useState(subRecord.width || 0);
  const [height, setHeight] = useState(subRecord.height || 0);
  const [negative, setNegative] = useState(subRecord.negative || false);
  const [total, setTotal] = useState(subRecord.total || 0);

  useEffect(() => {
    let l = parseFloat(length) || 0;
    let w = parseFloat(width) || 0;
    let h = parseFloat(height) || 0;
    let n = parseFloat(number) || 0;
    if (l === 0) l = 1;
    if (w === 0) w = 1;
    if (h === 0) h = 1;
    const t = calculateVolume(l, w, h) * n;
    setTotal(t);
    onUpdate({ ...subRecord, description, number, length, width, height, total: t, negative });
    // eslint-disable-next-line
  }, [description, number, length, width, height, negative]);

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ width: 30 }}>{index + 1}.</span>
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        style={{ flex: 2 }}
      />
      <input
        type="number"
        value={number}
        onChange={e => setNumber(e.target.value)}
        placeholder="No.s"
        style={{ width: 60 }}
      />
      <input
        type="number"
        value={length}
        onChange={e => setLength(e.target.value)}
        placeholder="Length"
        style={{ width: 60 }}
      />
      <input
        type="number"
        value={width}
        onChange={e => setWidth(e.target.value)}
        placeholder="Width"
        style={{ width: 60 }}
      />
      <input
        type="number"
        value={height}
        onChange={e => setHeight(e.target.value)}
        placeholder="Height"
        style={{ width: 60 }}
      />
      <span style={{ width: 80, textAlign: 'right' }}>{total}</span>
      <button onClick={() => setNegative(!negative)} style={{ color: negative ? 'red' : 'black' }} title="Toggle Less/Negative">{negative ? '-' : '+'}</button>
      <button onClick={() => onRemove(subRecord.id)} title="Delete Row">
        <img src={require('../assets/delete.png')} alt="Delete" style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
};

export default SubRecord; 