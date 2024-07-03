import React from "react";
import { Nav, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <Container>
        <Row className="footer-content">
          <Col className="footer-content-container">
            <div className="text-left py-3">
              <p>&copy; 2024 by Happy Pill Project. All Rights Reserved.</p>
            </div>
            <div className="footer-links">
              <Nav.Link as={Link} to="/home" className="footer-nav-link">
                HOME
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="footer-nav-link">
                CONTACT
              </Nav.Link>
              <Nav.Link as={Link} to="/gallery" className="footer-nav-link">
                GALLERY
              </Nav.Link>
              <Nav.Link as={Link} to="/services" className="footer-nav-link">
                SERVICES
              </Nav.Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
