// ResetPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ResetUserPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState(localStorage.getItem(''));
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate()

    const handleSendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/resetPassword/sendOtp', { email });
            setMessage(response.data.message);
            setStep(2); // Move to OTP input
        } catch (error) {
            setMessage('Error sending OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/resetPassword/confirmOtp', { email, otp });
            setMessage(response.data.message);
          
            setStep(3); // Move to new password input
        } catch (error) {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await axios.post('http://localhost:8000/user/resetPassword/newPassword', { email, newPassword });
            setMessage(response.data.message);
            alert(response.data.message)
            navigate("/userdashboard")
        } catch (error) {
            setMessage('Error changing password. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Card style={{ width: '30rem' }}>
                <Card.Header className="text-center">
                    <h3>Reset Password</h3>
                </Card.Header>
                <Card.Body>
                    {step === 1 && (
                        <Form>
                            <Form.Group as={Row} controlId="email">
                                <Form.Label column sm={4}>Email</Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="sendOtp">
                                <Col sm={{ span: 8, offset: 4 }}>
                                    <Button variant="primary" onClick={handleSendOtp}>Send OTP</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    )}
                    {step === 2 && (
                        <Form>
                            <Form.Group as={Row} controlId="otp">
                                <Form.Label column sm={4}>OTP</Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="verifyOtp">
                                <Col sm={{ span: 8, offset: 4 }}>
                                    <Button variant="primary" onClick={handleVerifyOtp}>Verify OTP</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    )}
                    {step === 3 && (
                        <Form>
                            <Form.Group as={Row} controlId="newPassword">
                                <Form.Label column sm={4}>New Password</Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="changePassword">
                                <Col sm={{ span: 8, offset: 4 }}>
                                    <Button variant="primary" onClick={handleChangePassword}>Change Password</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    )}
                    <Row className="mt-3">
                        <Col sm={{ span: 8, offset: 4 }}>
                            <p className="text-center text-danger">{message}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResetUserPassword;