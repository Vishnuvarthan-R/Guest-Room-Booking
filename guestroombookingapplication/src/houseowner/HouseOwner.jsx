import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../navbar/Navbar';
import './houseowner.css'

const RoomManager = () => {
  const [editIndex, setEditIndex] = useState(-1);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [minBookingPeriod, setMinBooking] = useState('');
  const [maxBookingPeriod, setMaxBooking] = useState('');
  const [rentPerDay, setRentPerDay] = useState('');
  const [rooms, setRooms] = useState([]);
  const [description,setDescription] = useState('')
  const [floorsize, setFloorSize] = useState('')
  const [numberofbed,setNumberOfBed] = useState('')
  const revealRoomsRef = useRef(null); // Create a ref for the reveal-rooms container

  useEffect(() => {
    axios.get('http://localhost:3001/getImage')
      .then(res => setRooms(res.data))
      .catch(err => console.log(err));
  }, []);

  const addRoom = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('minBookingPeriod', minBookingPeriod);
    formData.append('maxBookingPeriod', maxBookingPeriod);
    formData.append('rentPerDay', rentPerDay);
    formData.append('description',description)
    formData.append('floorsize',floorsize)
    formData.append('numberofbed',numberofbed)

    axios.post('http://localhost:3001/upload', formData)
      .then(res => {
        toast.success('Room added successfully!');
        setRooms([...rooms, res.data]);
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to add room.');
      });
      e.target.reset()

  };

  const updateRoom = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);
    formData.append('minBookingPeriod', minBookingPeriod);
    formData.append('maxBookingPeriod', maxBookingPeriod);
    formData.append('rentPerDay', rentPerDay);
    formData.append('description', description);
    formData.append('floorsize', floorsize);
    formData.append('numberofbed', numberofbed);

    axios.put(`http://localhost:3001/update/${rooms[editIndex]._id}`, formData)
      .then(res => {
        toast.success('Room updated successfully!');
        const updatedRooms = [...rooms];
        updatedRooms[editIndex] = res.data;
        setRooms(updatedRooms);
        setEditIndex(-1);
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to update room.');
      });
      e.target.reset()
  };

  const deleteRoom = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
      .then(res => {
        toast.success('Room deleted successfully!');
        setRooms(rooms.filter(room => room._id !== id));
      })
      .catch(err => {
        console.log(err);
        toast.error('Failed to delete room.');
      });
  };

  const editRoom = (index) => {
    const room = rooms[index];
    setEditIndex(index);
    setName(room.name);
    setMinBooking(room.minBookingPeriod);
    setMaxBooking(room.maxBookingPeriod);
    setRentPerDay(room.rentPerDay);
    setFile(null);
  };

  const scrollToRevealRooms = () => {
    revealRoomsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <NavBar scrollToRevealRooms={scrollToRevealRooms}/>
      <div className='room-manager'>
        <h1>Create Room</h1>
        <form onSubmit={editIndex === -1 ? addRoom : updateRoom} className='room-manager-container'>
            <label>Enter Room Name:</label>
            <input className='room-manager-containers' placeholder='Enter Room Name' type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Description:</label>
            <input className='room-manager-containers' placeholder='Give Description' type="text" name="name" value={description} onChange={(e) => setDescription(e.target.value)} />
            <label>floorsize:</label>
            <input className='room-manager-containers' placeholder='Enter Floor Size' type="text" name="name" value={floorsize} onChange={(e) => setFloorSize(e.target.value)} />
            <label>numberofbed:</label>
            <input className='room-manager-containers' placeholder='Enter Number Of Bed' type="number" name="name" value={numberofbed} onChange={(e) => setNumberOfBed(e.target.value)} />
            <label>Min Booking Period:</label>
            <input className='room-manager-containers' type="number" placeholder='Enter Min Booking Period' name="minBookingPeriod" min="1" value={minBookingPeriod} onChange={(e) => setMinBooking(e.target.value)} />
            <label>Max Booking Period:</label>
            <input className='room-manager-containers' placeholder='Enter Max Booking Period' type="number" name="maxBookingPeriod" max="30" value={maxBookingPeriod} onChange={(e) => setMaxBooking(e.target.value)} />
            <label>Rent Per Day:</label>
            <input className='room-manager-containers' placeholder='Enter Rent Per Day' type="text" name="rentPerDay" value={rentPerDay} onChange={(e) => setRentPerDay(e.target.value)} />
            <label>Photos:</label>
            <input className='room-manager-containers' type="file" accept="image/*" multiple onChange={e => setFile(e.target.files[0])} />
            <button className='room-manager-containers' type="submit">{editIndex === -1 ? 'Add Room' : 'Update Room'}</button>
        </form>
        <div className='display-rooms-containers'>
          <h2>Rooms List</h2>
          <div className='reveal-rooms' ref={revealRoomsRef}>
            {rooms.map((room, index) => (
              <div key={room._id}>
                <table>
                    <tr>
                      <th>Room Name</th>
                      <th>Min Booking Period</th>
                      <th>Max Booking Period</th>
                      <th>Rent Per Day</th>
                      <th>Room Image</th>
                    </tr>
                    <tr>
                      <td>{room.name}</td>
                      <td>{room.minBookingPeriod}</td>
                      <td>{room.maxBookingPeriod}</td>
                      <td>{room.rentPerDay}</td>
                      <td><img src={`http://localhost:3001/Images/${room.file}`} alt={room.name} height={"200px"} width={"250px"} /></td>
                    </tr>
                </table>
                <button onClick={() => editRoom(index)} className='edit'>Edit</button>
                <button onClick={() => deleteRoom(room._id)} className='delete'>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManager;