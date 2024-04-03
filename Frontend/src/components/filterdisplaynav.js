import React from "react";

const Filterdisplaynav = (props) => {
  const pageSize = props.pageSize;
  const setPageSize = props.setPageSize;

  const handleRowsChange = (e) => {
    const rows = parseInt(e.target.value);
    setPageSize(rows);
  };
  return (
    <>
      <nav className="bg-secondary text-white d-md-flex justify-content-around ps-lg-3 pe-lg-3 p-2">
        <div className="d-md-flex  text-center">
          <label className="fs-5 pe-4">Filter</label>
          <select className="form-select">
            <option>Most Recent</option>
          </select>
        </div>
        <div className="d-md-flex  text-center">
          <label className="fs-5 pe-4">Display</label>
          {/* <select className='form-select'>
                    <option>3</option>
                    <option>6</option>
                    <option>9</option>
                    </select> */}
          <select
            name="dynamic-table_length"
            aria-controls="dynamic-table"
            className="form-select"
            id="rowsDropdown"
            onChange={handleRowsChange}
            value={pageSize}
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="15">15</option>
          </select>
        </div>
      </nav>
    </>
  );
};

export default Filterdisplaynav;
