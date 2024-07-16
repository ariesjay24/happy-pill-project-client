import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Table,
  Spinner,
  Modal,
} from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import http from "../../lib/http";
import "./Bookings.css";

const Bookings = ({ user }) => {
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    userName:
      user?.FirstName && user?.LastName
        ? `${user.FirstName} ${user.LastName}`
        : "",
    serviceType: "",
    bookingDate: "",
    bookingTime: "",
    location: "",
    addOns: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
    fetchAvailability();
    fetchBookings();
  }, []);

  const fetchServices = async () => {
    try {
      const api = http();
      const response = await api.get("/services");
      setServices(response.data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services");
    }
  };

  const fetchAvailability = async () => {
    try {
      const api = http();
      const response = await api.get("/availabilities");
      setAvailability(response.data || []);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setError("Failed to fetch availability");
    }
  };

  const fetchBookings = async () => {
    try {
      const api = http();
      const response = await api.get("/bookings");
      const bookingsData = response.data.bookings || [];

      const parsedBookings = bookingsData.map((booking) => {
        let addOns = [];
        try {
          addOns = Array.isArray(booking.AddOns)
            ? booking.AddOns
            : JSON.parse(booking.AddOns || "[]");
        } catch (error) {
          console.error("Error parsing AddOns:", error);
        }
        return { ...booking, AddOns: addOns };
      });

      setBookings(parsedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prevForm) => {
        const updatedAddOns = checked
          ? [...prevForm.addOns, value]
          : prevForm.addOns.filter((addOn) => addOn !== value);
        return { ...prevForm, addOns: updatedAddOns };
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const calculateTotalPrice = () => {
    const selectedService = services.find(
      (service) => service.Name === form.serviceType
    );
    const servicePrice = selectedService
      ? parseFloat(selectedService.Price)
      : 0;
    const addOnsPrice = form.addOns.reduce((total, addOn) => {
      const addOnService = services.find((service) => service.Name === addOn);
      return total + (addOnService ? parseFloat(addOnService.Price) : 0);
    }, 0);
    return servicePrice + addOnsPrice;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const api = http();
      const response = await api.post("/bookings", {
        ...form,
        bookingDate: selectedDate.toISOString().split("T")[0],
      });
      const bookingId = response.data.booking.BookingID;
      await handlePayment(bookingId);
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      const api = http();
      const response = await api.post(
        `/bookings/${bookingId}/initiate-payment`
      );
      if (response.data.paymentUrl) {
        setPaymentUrl(response.data.paymentUrl);
        setShowPaymentModal(true);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Failed to initiate payment");
    }
  };

  const isDateAvailable = (date) => {
    return !availability.some(
      (avail) => new Date(avail.date).toDateString() === date.toDateString()
    );
  };

  return (
    <Container className="bookings-container">
      <Row>
        <Col md={6}>
          <h1>Client Details</h1>
          <hr />
          <h5 className="mb-4">Create your Booking</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="form-booking" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="userName">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="serviceType">
              <Form.Label>Service Type</Form.Label>
              <Form.Control
                as="select"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Select Service</option>
                {services
                  .filter((service) => !service.isAddOn)
                  .map((service) => (
                    <option key={service.ServiceID} value={service.Name}>
                      {service.Name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="addOns">
              <Form.Label>Add Ons</Form.Label>
              {services
                .filter((service) => service.isAddOn)
                .map((addOn) => (
                  <Form.Check
                    key={addOn.ServiceID}
                    type="checkbox"
                    label={`${addOn.Name} (₱${parseFloat(addOn.Price).toFixed(
                      2
                    )})`}
                    name="addOns"
                    value={addOn.Name}
                    checked={form.addOns.includes(addOn.Name)}
                    onChange={handleChange}
                  />
                ))}
            </Form.Group>

            <Form.Group className="mb-3" controlId="bookingDate">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                name="bookingDate"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="bookingTime">
              <Form.Label>Booking Time</Form.Label>
              <Form.Control
                type="time"
                name="bookingTime"
                value={form.bookingTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <hr />
            <div className="fs-5 mt-3">
              <strong>
                Total Price: ₱
                {calculateTotalPrice().toFixed(2).toLocaleString()}
              </strong>
            </div>

            <Button
              type="submit"
              className="booking-btn mt-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Create Booking"
              )}
            </Button>
          </Form>
        </Col>
        <Col className="availability-section" md={6}>
          <div className="availability-title">
            <h2>Check Availability</h2>
            <h5 className="mb-4">Select a Time and Date</h5>
          </div>

          <Calendar
            className="calendar-section"
            onChange={setSelectedDate}
            value={selectedDate}
            tileDisabled={({ date }) => !isDateAvailable(date)}
          />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h2>Your Bookings</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User Name</th>
                <th>Service</th>
                <th>Add Ons</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.BookingID}>
                  <td>{booking.BookingID}</td>
                  <td>{`${booking.user?.FirstName} ${booking.user?.LastName}`}</td>
                  <td>{booking.service?.Name}</td>
                  <td>{booking.AddOns.join(", ")}</td>
                  <td>{booking.BookingDate}</td>
                  <td>{booking.BookingTime}</td>
                  <td>{booking.Location}</td>
                  <td>{booking.Status}</td>
                  <td>
                    {booking.payment_status === "Paid" ? (
                      "Paid"
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePayment(booking.BookingID)}
                      >
                        Pay with GCash
                      </Button>
                    )}
                  </td>
                  <td>₱{parseFloat(booking.Price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>GCash Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Click the link below to proceed with GCash payment:</p>
          <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
            Pay Now
          </a>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Bookings;
