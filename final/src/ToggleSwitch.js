const ToggleSwitch = ({ onToggle }) => {
  

    return (
      <>
        <label className="switch toggle-switch">
          <input type="checkbox" onChange={onToggle} />
          <span className="slider round"></span>
        </label>
      </>
    );
  };
  
  export default ToggleSwitch;
  