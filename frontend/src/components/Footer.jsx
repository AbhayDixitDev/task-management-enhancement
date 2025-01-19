import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className="mt-auto py-3 bg-light" style={{position: "fixed",bottom: 0,zIndex: 500,width:"100vw"}}>
      <Container>
        <Row>
          <Col sm={{ span: 10, offset: 1 }}>
            <p className="text-center text-muted">
              Copyright &copy; {new Date().getFullYear()} All rights reserved.
            </p>
            <div className="text-center">
              <a className="text-dark me-2" href="https://www.facebook.com/">
                <FaFacebook size="2em" />
              </a>
              <a className="text-dark me-2" href="https://twitter.com/">
                <FaTwitter size="2em" />
              </a>
              <a className="text-dark me-2" href="https://www.instagram.com/">
                <FaInstagram size="2em" />
              </a>
              <a className="text-dark me-2" href="https://github.com/abhaydixitdev">
                <FaGithub size="2em" />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
