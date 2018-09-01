import React, { Fragment } from 'react';

function GreenPass(props) {
  return (
    <Fragment>
      <span className='sr-only'>Passed</span>
      <svg
        height='50'
        viewBox='0 0 200 200'
        width='50'
        xmlns='http://www.w3.org/2000/svg'
        {...props}
        >
        <g>
          <title>Passed</title>
          <circle
            cx='100'
            cy='99'
            fill='#006400'
            r='95'
            stroke='#006400'
            strokeDasharray='null'
            strokeLinecap='null'
            strokeLinejoin='null'
          />
          <rect
            fill='#ffffff'
            height='30'
            stroke='#ffffff'
            strokeDasharray='null'
            strokeLinecap='null'
            strokeLinejoin='null'
            transform='rotate(-45, 120, 106.321)'
            width='128.85878'
            x='55.57059'
            y='91.32089'
          />
          <rect
            fill='#ffffff'
            height='30'
            stroke='#ffffff'
            strokeDasharray='null'
            strokeLinecap='null'
            strokeLinejoin='null'
            transform='rotate(45, 66.75, 123.75)'
            width='80.66548'
            x='26.41726'
            y='108.75'
          />
        </g>
      </svg>
    </Fragment>
  );
}

GreenPass.displayName = 'GreenPass';

export default GreenPass;
