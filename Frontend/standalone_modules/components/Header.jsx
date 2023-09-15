import React from 'react';
import { BrowserRouter as Router, Switch, Route,Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import {logo} from './logo.png';
import './header_1.css';
import {Poll} from './Poll'
export default function Header() {
  return (
    
    <header>

<div class="bg-pattern min-h-full overflow-x-hidden snipcss-1r7gb">
      <div class="mx-auto flex max-w-7xl items-center py-8 px-8">
        <div class="grow">
          <div class="relative inline-block">
            <a class="inline-block rounded" href="#">
              <img src={require('./logo.png').default} style={{width:180, height:60}}/>
            </a>
          </div>
        </div>
        <nav class="hidden items-center space-x-8 sm:flex">
          <Router>
          <a class="hover:text-primary-500 rounded text-gray-400 transition-colors  hover:underline-offset-2  font-bold text-gray-600">
            <Link to="/" onClick={() => {window.location.href="/"}} >About</Link>
          </a> 
          <a class="hover:text-primary-500 rounded text-gray-400 transition-colors hover:no-underline hover:underline-offset-2" >
           
            <Link to="/Poll" onClick={() => {window.location.href="/Poll"}} >Poll</Link>
            {/* <Route exact path="dashboard.html" render={() => {window.location.href="./dashboard.html"}} /> */}
           </a>
          <a href="#" class="hover:text-primary-500 rounded text-gray-400 transition-colors hover:no-underline hover:underline-offset-2">
            Login
          </a>
          <a href="#" class="hover:text-primary-500 rounded text-gray-400 transition-colors hover:no-underline hover:underline-offset-2">
          <Link to="/Meeting" onClick={() => {window.location.href="/Meeting"}} >Meeting</Link>
          </a>
          <a href="#" class="hover:text-primary-500 rounded text-gray-400 transition-colors hover:no-underline hover:underline-offset-2">
            Sign up
          </a> 
          </Router>
        </nav>
      </div>
    </div>
    </header>
    
  );
}
