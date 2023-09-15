import React, { useState } from 'react';
import Layout from "../src/components/Layout";
import axios from 'axios';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import toastOptions from "../src/helpers/toastOptions";

export default function Signup() {
  const authval = 0;
  function auth() {
    return authval;
  }
  const history = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setconfirmpassword] = useState('');
  const [error, setError] = useState(null);
  const [perror, setPerror] = useState(null);
  let flag = 0;
  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function emailvalidation(email) {
    if (!isValidEmail(email)) {
      setError('Email is invalid');
      flag = 1;
    } else {
      setError(null);
      flag = 0;
    }
  }

  function passwordvalidation(param) {
    if (param != password) {
      flag = 1;
      setPerror('Password and confirm password does not match');
    } else {
      setPerror(null);
      flag = 0;
    }
  }

  function handleSubmit(param) {
    if (error != null && perror != null) {
      toast.error("Please enter valid email and password !!", toastOptions);
      return;
    }

    const req_object = {};
    req_object.email = param.email;
    req_object.password = param.password;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    axios
      .post(
        'https://application-9b.115t501qrjh8.us-east.codeengine.appdomain.cloud/signup',
        req_object, config
      )
      .then((response) => {
        if (response && response.data && response.data.status == 409) {
          toast.error(response.data.message, toastOptions);
          return;
        }
        if ((response && response.data.message[0].user_id) || (response && response.data.message)) {
          toast.success("Account has been successfully created!!", toastOptions);
          history.push('/login');
        } else {
          toast.error("Signup failed !!", toastOptions);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <Layout>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <h1>Sign Up</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={6} md={8} sm={10}>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Email Id</Form.Label>
              <Form.Control
                name="email"
                type="text"
                placeholder="Enter Email ID"
                value={email}
                onChange={e => { setEmail(e.target.value); emailvalidation(e.target.value) }}
              />
              {error && <Form.Text style={{ color: 'red' }}>{error}</Form.Text>}
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
            <Form.Group controlId="confirmpassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                name="confirmpassword"
                type="password"
                placeholder="Re-enter Password"
                value={confirmpassword}
                onChange={e => { setconfirmpassword(e.target.value); passwordvalidation(e.target.value) }}
              />
              {perror && <Form.Text style={{ color: 'red' }}>{perror}</Form.Text>}
            </Form.Group>
            < Button
              style={{ backgroundColor: " gray" }}
              variant="primary"
              className="mt-3"
              block
              disabled={error != null || perror != null || password == "" || confirmpassword == ""}
              onClick={() => handleSubmit({ email, password, confirmpassword })}
            >
              Sign Up
            </Button>
          </Form>
        </Col>
        <ToastContainer />
      </Row>
    </Layout >
  );
}
