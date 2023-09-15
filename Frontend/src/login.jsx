import React, { useState } from 'react';
import Layout from "../src/components/Layout";
import axios from 'axios';
import { useRouter } from "next/router";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import UserProfile from './session';


export default function Login() {
  const history = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function emailvalidation(email) {
    if (!isValidEmail(email)) {
      setError('Email is invalid');
    } else {
      setError(null);
    }
  }

  function handleSubmit() {
    const login_obj = {
      email: email,
      password: password,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    axios.post('http://34.125.236.71:8080/login', login_obj, config)
      .then((response) => {
        if (response && response.data.user_id) {
          alert("Logged in successfully!!");
          UserProfile.setName(response.data.email);
          UserProfile.setId(response.data.email);
          history.push('/calendar');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <Layout>
      <Row className="justify-content-center mt-4">
        <Col md={6}>
          <h1 className="text-center"><b>Login</b></h1>
          <Form>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="text"
                placeholder="Enter Email ID"
                value={email}
                onChange={e => { setEmail(e.target.value); emailvalidation(e.target.value) }}
              />
              {error && <p className="text-danger">{error}</p>}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" onClick={() => handleSubmit()} block style={{ backgroundColor: " gray" }}>Login</Button>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}
