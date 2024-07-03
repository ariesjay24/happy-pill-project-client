import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import http from "../../lib/http";
import "./Services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const api = http();
      const response = await api.get("/services");
      const allServices = response.data.services || [];
      const servicePackages = allServices.filter((service) => !service.isAddOn);
      const serviceAddOns = allServices.filter((service) => service.isAddOn);

      setServices(servicePackages);
      setAddOns(serviceAddOns);
      setLoading(false);
    } catch (error) {
      setError("Error fetching services");
      setLoading(false);
    }
  };

  const handleShowModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  const handleBookNow = () => {
    setShowModal(false);
    navigate("/bookings", {
      state: { service: selectedService, addOns: selectedAddOns },
    });
  };

  const filterServices = (keywords) => {
    return services.filter((service) =>
      keywords.some((keyword) =>
        service.Name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
  };

  const weddingPackages = filterServices([
    "wedding photo package",
    "package 1",
    "package 2",
    "package 3",
    "package 4",
    "package 5",
    "package 6",
  ]);

  const debutPackages = filterServices(["debut package"]);

  const birthdayChristeningPackages = filterServices([
    "birthday & christening package",
  ]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className="services-container">
      <div className="service-title">
        <h3 className="text-center mt-4">Wedding Packages</h3>
      </div>
      <Row className="mt-4">
        {weddingPackages.length > 0 ? (
          weddingPackages.map((service) => (
            <Col md={4} key={service.ServiceID} className="mb-4">
              <Card className="h-100 mb-3">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <span className="badge-title fs-4 badge w-75 rounded-pill">
                      {service.Name}
                    </span>
                  </Card.Title>
                  <Card.Text className="fw-bold fs-3 package-price">
                    ₱{service.Price.toLocaleString()}
                  </Card.Text>
                  <Card.Text className="service-description flex-grow-1">
                    {service.Description.replace(/\\n/g, "\n")}
                  </Card.Text>
                  <Button
                    className="button-services mt-auto"
                    onClick={() => handleShowModal(service)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div>No wedding packages available</div>
        )}
      </Row>
      <div className="service-title">
        <h3 className="text-center mt-4">Debut Packages</h3>
      </div>
      <Row className="mt-4">
        {debutPackages.length > 0 ? (
          debutPackages.map((service) => (
            <Col md={4} key={service.ServiceID} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <span className="badge-title fs-4 badge w-75 rounded-pill">
                      {service.Name}
                    </span>
                  </Card.Title>{" "}
                  <Card.Text className="fw-bold fs-3 package-price">
                    ₱{service.Price.toLocaleString()}
                  </Card.Text>
                  <Card.Text className="service-description flex-grow-1">
                    {service.Description.replace(/\\n/g, "\n")}
                  </Card.Text>
                  <Button
                    className="button-services mt-auto"
                    onClick={() => handleShowModal(service)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div>No debut packages available</div>
        )}
      </Row>
      <div className="service-title">
        <h3 className="text-center mt-4">Birthday & Christening Packages</h3>
      </div>
      <Row className="mt-4">
        {birthdayChristeningPackages.length > 0 ? (
          birthdayChristeningPackages.map((service) => (
            <Col md={4} key={service.ServiceID} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <span className="badge-title fs-4 badge w-75 rounded-pill">
                      {service.Name}
                    </span>
                  </Card.Title>{" "}
                  <Card.Text className="fw-bold fs-3 package-price">
                    ₱{service.Price.toLocaleString()}
                  </Card.Text>
                  <Card.Text className="service-description flex-grow-1">
                    {service.Description.replace(/\\n/g, "\n")}
                  </Card.Text>
                  <Button
                    className="button-services mt-auto"
                    onClick={() => handleShowModal(service)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div>No birthday & christening packages available</div>
        )}
      </Row>

      <h3 className="text-center mt-4">Add Ons</h3>
      <Row className="mt-4">
        {addOns.length > 0 ? (
          addOns.map((addOn) => (
            <Col md={4} key={addOn.ServiceID} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>
                    <span className="badge-title fs-4 badge w-75 rounded-pill">
                      {addOn.Name}
                    </span>
                  </Card.Title>
                  <Card.Text className="fw-bold fs-3 package-price">
                    ₱{addOn.Price.toLocaleString()}
                  </Card.Text>
                  <Button
                    className="button-services mt-auto"
                    onClick={() => handleShowModal(addOn)}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <div>No add-ons available</div>
        )}
      </Row>

      {selectedService && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedService.Name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Description:</strong>{" "}
              {selectedService.Description.replace(/\\n/g, "\n")}
            </p>
            <p>
              <strong>Price:</strong> ₱{selectedService.Price.toLocaleString()}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button className="button-services" onClick={handleBookNow}>
              Book Now
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Services;
