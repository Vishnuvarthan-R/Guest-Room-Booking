import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import './customer.css';

const Customer = () => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/getImage')
      .then(res => {
        const storedRooms = JSON.parse(localStorage.getItem('bookedRooms')) || [];
        const updatedRooms = res.data.map(room => ({
          ...room,
          isBooked: storedRooms.includes(room._id)
        }));
        setRooms(updatedRooms);
        setAvailableRooms(updatedRooms);
      })
      .catch(err => console.log(err));
  }, []);

  const filterAvailableRooms = () => {
    console.log("clicked")
    if (!checkIn || !checkOut) {
      toast.error('Please select both check-in and check-out dates.');
      return;
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const filteredRooms = rooms.filter(room => {
      const roomBookings = room.bookings || [];
      const isRoomAvailable = roomBookings.every(booking => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        return (
          startDate >= bookingEnd || // Check if the selected dates are after the booking end date
          endDate <= bookingStart   // Check if the selected dates are before the booking start date
        );
      });
      return isRoomAvailable && !room.isBooked; // Ensure the room is not already booked
    });

    setAvailableRooms(filteredRooms);
    console.log('Filtered Rooms:', filteredRooms);
  };

  const addRoom = (e) => {
    e.preventDefault();
    if (!selectedRoom) return;

    axios.post('http://localhost:3001/booking', {
      roomName: selectedRoom.name,
      checkIn,
      checkOut,
      roomType
    })
      .then(res => {
        if (res.data === "booking success") {
          const updatedRooms = rooms.map(room => 
            room._id === selectedRoom._id ? { ...room, isBooked: true } : room
          );
          setRooms(updatedRooms);
          localStorage.setItem('bookedRooms', JSON.stringify(updatedRooms.filter(room => room.isBooked).map(room => room._id)));
          setShowForm(false);
          navigate('/CustomerLogin');
          toast.success('Room booked successfully!');
        } else {
          toast.error('Failed to book the room. Please try again later.');
        }
      })
      .catch(err => {
        console.log(err);
        toast.error('An error occurred while booking the room.');
      });
  };

  const toggleForm = (room) => {
    setSelectedRoom(room);
    setShowForm(!showForm);
  };

  const openModal = (room) => {
    setSelectedRoom(room);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className='customer-container'>
      <div className="header">
        <a href="">Guest Room Booking</a>
        <nav className="nav-bar">
          <a href="/login">Logout</a>
        </nav>
      </div>
        <div className="header-container">
          <div className="header-content">
            <h2>Enjoy Your Vacation</h2>
            <p>Book Rooms and stay packages at lowest price</p>
          </div>
        </div>
      <br />
      <div className='rooms-container'>
      <h1>Available Rooms</h1>
      <div className="date-picker-container">
        <DatePicker
          selected={checkIn}
          onChange={date => setCheckIn(date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          placeholderText="Check-in Date"
          className='check-in'
        />
        <DatePicker
          selected={checkOut}
          onChange={date => setCheckOut(date)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn}
          placeholderText="Check-out Date"
          className='check-out'
        /><br />
        <button onClick={filterAvailableRooms} className='availability-button'>Check Availability</button>
      </div>
      <div className='display_rooms_container'>
            <table className='table-rooms'>
                {availableRooms.map(room => (
                <div key={room._id} className='display_rooms' style={{marginBottom:"20px"}}>
                    <tr>
                        <td><th>Room Name</th></td>
                        <td><th>Min Booking Period</th></td>
                        <td><th>Max Booking Period</th></td>
                        <td><th>Rent Per Day</th></td>
                        <td><th>Room Image</th></td>
                    </tr> 
                    <tr>
                        <td><h2 className='room-name'>{room.name}</h2></td>
                        <td><p>{room.minBookingPeriod}</p></td>
                        <td><p> {room.maxBookingPeriod}</p></td>
                        <td><p>{room.rentPerDay}</p></td>
                        <td><img src={`http://localhost:3001/Images/${room.file}`} alt={room.name}  height={"200px"} width={"250px"} /></td>
                    </tr> 
                    <br />
                  <div className='book_container'>
                    <button
                        className='book'
                        onClick={() => toggleForm(room)}
                        // style={{ backgroundColor: room.isBooked ? 'green' : 'silver' }}
                        disabled={room.isBooked}
                      >
                      {room.isBooked ? 'Booked' : 'Book Now'}
                    </button>
                    <button
                        className='view-details'
                        onClick={() => openModal(room)}
                    >
                    View Details
                    </button>
                  </div>
                </div>
                ))}
              </table>
        </div>
      </div>
      {showForm && selectedRoom && (
        <div className="formm-container">
          <form id="reservationForm" className="zoom-in" onSubmit={addRoom}>
            <h2>Hotel Reservation Form</h2>
            <label htmlFor="name">Room Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={selectedRoom.name}
              disabled
            />
            <label htmlFor="checkin">Check-in Date:</label>
            <input type="date" id="checkin" name="checkin" required onChange={(e) => setCheckIn(e.target.value)} />

            <label htmlFor="checkout">Check-out Date:</label>
            <input type="date" id="checkout" name="checkout" required onChange={(e) => setCheckOut(e.target.value)} />

            <label htmlFor="roomtype">Room Type:</label>
            <select id="roomtype" name="roomtype" required onChange={(e) => setRoomType(e.target.value)}>
              <option value="">Select Room Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>

            <input type="submit" value="Submit Reservation" id="submit" />
          </form>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Room Details"
        className="Modal"
        overlayClassName="Overlay"
      >
        {selectedRoom && (
          <div className="selected-room-details-container">
          <div className="selected-room-details">
            <h2>Room Details</h2>
            <p className="room-detail"><strong>Name:</strong> {selectedRoom.name}</p>
            <p className="room-detail"><strong>Min Booking Period:</strong> {selectedRoom.minBookingPeriod}</p>
            <p className="room-detail"><strong>Max Booking Period:</strong> {selectedRoom.maxBookingPeriod}</p>
            <p className="room-detail"><strong>Number Of Bed:</strong> {selectedRoom.numberofbed}</p>
            <p className="room-detail"><strong>Rent Per Day:</strong> {selectedRoom.floorsize}</p>
            <p className="room-detail"><strong>Description:</strong> {selectedRoom.description}</p>
            <img src={`http://localhost:3001/Images/${selectedRoom.file}`} width={"250px"} alt={selectedRoom.name} className="room-image" />
            <br />
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
          </div>
        )}
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Customer;
