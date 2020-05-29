import React from 'react';

export default function Header() {
  return (
    <div className="header day-labels">
      <div className="day-label header-cell day-sunday">Su</div>
      <div className="day-label header-cell day-monday">Mo</div>
      <div className="day-label header-cell day-tuesday">Tu</div>
      <div className="day-label header-cell day-wednesday">We</div>
      <div className="day-label header-cell day-thursday">Th</div>
      <div className="day-label header-cell day-friday">Fr</div>
      <div className="day-label header-cell day-saturday">Sa</div>
    </div>
  );
}
