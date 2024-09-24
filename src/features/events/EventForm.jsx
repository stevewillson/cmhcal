import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent } from './eventsSlice';
import { saveEvent } from '../../db';
import { v4 as uuidv4 } from 'uuid';

const EventForm = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('orange');
  const [url, setUrl] = useState('');

  const handleAddEvent = async () => {
    if (!title || !start || !end) return alert('Please fill in all fields.');
    const newEvent = {
      title,
      start,
      end,
      id: uuidv4(),
      category: { name: category, color },
      color,
      url
    };
    await saveEvent(newEvent);
    dispatch(addEvent(newEvent));
    setTitle('');
    setStart('');
    setEnd('');
    setCategory('');
    setColor('orange');
    setUrl('');
  };

  return (
    <div>
      <h2>Add Event</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="date" placeholder="Start Date" value={start} onChange={(e) => setStart(e.target.value)} />
      <input type="date" placeholder="End Date" value={end} onChange={(e) => setEnd(e.target.value)} />
      <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
      <input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleAddEvent}>Add Event</button>
    </div>
  );
};

export default EventForm;
