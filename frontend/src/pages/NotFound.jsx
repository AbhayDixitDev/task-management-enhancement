import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import './NotFound.css'; // Import custom CSS for additional styling

const NotFound = () => {
    useEffect(() => {
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create a geometry and material for the background
        const geometry = new THREE.SphereGeometry(100, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 5;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();

        // Clean up on component unmount
        return () => {
            document.body.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <Container fluid className="not-found">
            <Row>
                <Col>
                    <h1 className="futuristic-title">404 - Page Not Found</h1>
                    <p className="futuristic-text">The page you are looking for does not exist.</p>
                </Col>
            </Row>
            <Row>
                <Col className="text-center">
                    <Link to="/login">
                        <Button variant="primary" className="futuristic-button" size="lg">Login</Button>
                    </Link>
                </Col>
                <Col className="text-center">
                    <Link to="/userdashboard">
                        <Button variant="success" className="futuristic-button" size="lg">User  Dashboard</Button>
                    </Link>
                </Col>
                <Col className="text-center">
                    <Link to="/admindashboard">
                        <Button variant="danger" className="futuristic-button" size="lg">Admin Dashboard</Button>
                    </Link>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;