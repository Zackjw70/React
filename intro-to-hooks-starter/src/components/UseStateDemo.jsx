import { useState } from 'react';

export const UseStateDemo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [showCounter, setShowCounter] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
  };

  return (
    <>
      <div className="header">useState Demo</div>
      <div className="flex-row">
        <button
          className="button"
          onClick={() => setShowCounter((counter) => !counter)}
        >
          Toggle Counter
        </button>
      </div>

      <hr />
      <div className="container">
        {showCounter ? (
          <Counter />
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

// Render for previous value demo
const Counter = () => {
  const [counter, setCounter] = useState(0);

  const handleAdd = () => {
    setTimeout(() => {
      setCounter(counter + 1);
    }, 1000);
  };

  const handleAddWithCallback = () => {
    setTimeout(function delay() {
      setCounter((currentCounterValue) => currentCounterValue + 1);
    }, 1000);
  };

  return (
    <div className="flex-column">
      <span>Counter value: {counter}</span>
      <button onClick={handleAdd} className="button">
        Add
      </button>
      <button onClick={() => setCounter(counter - 1)} className="button">
        Subtract
      </button>
      <button onClick={handleAddWithCallback} className="button">
        Add with callback
      </button>
    </div>
  );
};
