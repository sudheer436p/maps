import logo from "./logo.svg";
import "./App.css";
import Places from "./components/Places";
import Gmap from "./components/Gmap";
import React, { useState, Fragment } from "react";
import LiveClock from "./components/LiveClock";
import styled from "styled-components";

// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 2em;
  background: papayawhip;
`;

function App() {
  return (
    <Wrapper>
      <LiveClock />
      <Gmap />
    </Wrapper>
  );
}

export default App;
