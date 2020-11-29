import React, { useState, useEffect } from "react";

import styled from "styled-components";

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 1em;
  background: papayawhip;
`;

const Clock = styled.div`
  && {
    color: blue;
  }
`;

function LiveClock() {
  const [dt, setDt] = useState(new Date().toLocaleString());

  useEffect(() => {
    let Timer = setInterval(() => {
      setDt(new Date().toLocaleString());
    }, 10000);

    return () => clearInterval(Timer);
  }, []);

  return (
    <Wrapper>
      <Clock>{dt}</Clock>
    </Wrapper>
  );
}

export default LiveClock;
