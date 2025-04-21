import React, { useState } from "react";

export default function CustomCheckbox({ text, onCheck, checked }) {
  const [checkedI, setChecked] = useState(checked);

  const handleChange = (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    if (onCheck) {
      onCheck(newChecked);
    }
  };

  return (
    <label style={styles.label}>
      {/* Hidden native checkbox for accessibility */}
      <div style={{width: '40px'}}>
        <input
          type="checkbox"
          checked={checkedI}
          onChange={handleChange}
          style={styles.hiddenCheckbox}
        />
        <span
          style={{
            ...styles.customCheckbox,
            backgroundColor: checked ? "#087EA4" : "#fff",
          }}
        >
        {checked && <span style={styles.checkmark}></span>}
      </span>
      </div>

      {/* Visual replacement for the checkbox */}

      <span style={styles.text}>{text}</span>
    </label>
  );
}

const styles = {
  label: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: 10,
  },
  hiddenCheckbox: {
    position: "absolute",
    opacity: 0,
    cursor: "pointer",
  },
  customCheckbox: {
    display: "inline-block",
    width: 20,
    height: 20,
    marginRight: 8,
    border: "2px solid #087EA4",
    borderRadius: 4,
    position: "relative",
    boxSizing: "border-box",
    transition: "all 0.2s",
  },
  checkmark: {
    position: "absolute",
    top: 2,
    left: 5,
    width: 5,
    height: 10,
    borderRight: "2px solid #fff",
    borderBottom: "2px solid #fff",
    transform: "rotate(45deg)",
  },
  text: {
    fontSize: 15,
    fontWeight: 400,
  },
};
