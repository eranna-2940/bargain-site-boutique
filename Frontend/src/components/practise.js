import React, { useState } from 'react';

function Practise() {
  const [openDivIndex, setOpenDivIndex] = useState(-1);

  const toggleDiv = (index) => {
    setOpenDivIndex(prevIndex => {
      if (prevIndex === index) {
        // Clicked on the currently open div, so close it
        return -1;
      } else {
        // Clicked on a different div, so open it and close the currently open one
        return index;
      }
    });
  };

  return (
    <div>
      <div onClick={() => toggleDiv(0)} style={{ backgroundColor: openDivIndex === 0 ? 'lightblue' : 'white' }}>
        <h2>Div 1</h2>
        {openDivIndex === 0 && <p>This is the content of div 1.</p>}
      </div>
      <div onClick={() => toggleDiv(1)} style={{ backgroundColor: openDivIndex === 1 ? 'lightgreen' : 'white' }}>
        <h2>Div 2</h2>
        {openDivIndex === 1 && <p>This is the content of div 2.</p>}
      </div>
      <div onClick={() => toggleDiv(2)} style={{ backgroundColor: openDivIndex === 2 ? 'lightyellow' : 'white' }}>
        <h2>Div 3</h2>
        {openDivIndex === 2 && <p>This is the content of div 3.</p>}
      </div>
    </div>
  );
}

export default Practise;
