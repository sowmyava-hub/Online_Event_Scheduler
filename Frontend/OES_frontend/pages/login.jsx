import React, { useState } from 'react';
import Layout from "../src/components/Layout";
import axios from 'axios';
import { useRouter } from "next/router";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router';
import UserProfile from './session';
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import toastOptions from "../src/helpers/toastOptions";

export default function Login() {
  const history = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let new_created_polls = [];
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
        'Content-Type': 'application/json'
        //'Access-Control-Allow-Origin': '*'
      }
    };
    axios.post('https://application-9b.115t501qrjh8.us-east.codeengine.appdomain.cloud/login', login_obj, config)
      .then((response) => {
        if (response && response.data && (response.data.status == 408 || response.data.status == 410)) {
          if (response.data.status == 410) {
            toast.error("Password Incorrect", toastOptions);
          } else {
            toast.error(response.data.message, toastOptions);
          }

          return;
        }
        if ((response && response.data.message[0].user_id) || (response && response.data.message)) {
          toast.success("Logged in successfully!!", toastOptions);
          UserProfile.setName(response.data.email);
          UserProfile.setId(response.data.user_id);
          axios
            .get(
              'https://application-9b.115t501qrjh8.us-east.codeengine.appdomain.cloud/api/meeting?userid=' + UserProfile.getId()
            )
            .then((response) => {
              if (response && response.data && response.data['Meeting details']) {
                //console.log("meeting fetched");
                for (let i = 0; i < response.data['Meeting details'].length; i++) {
                  let data_obj = response.data['Meeting details'][i];
                  let obj = {};
                  obj[data_obj.endate + "-" + data_obj.title + "-" + data_obj.userid] = data_obj.secret;
                  new_created_polls.push(obj);
                }
                UserProfile.setUserData(new_created_polls);
                history.push('/homecalendar');


              }
            })
            .catch(error => {
              console.error(error);
            });


        } else {
          toast.error("Login failed!!", toastOptions);
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

            <Button variant="primary" onClick={() => handleSubmit()} block style={{ backgroundColor: " gray" }}
              disabled={error != null || password == ""}
            >Login</Button><br />
            <span style={{ display: "flex", marginLeft: "30%" }}>Don't have an account?&nbsp;&nbsp;<Link href="/Signup"><b style={{ textDecoration: "underline", cursor: "pointer" }}>Create an account</b></Link></span>
          </Form>
        </Col>
        <ToastContainer />
      </Row>
    </Layout>
  );
}
