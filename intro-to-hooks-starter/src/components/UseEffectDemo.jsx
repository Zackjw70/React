import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";

const UseEffectDemo = () => {
  const { startingCount } = useParams();
  const startingCountNumber = Number(startingCount) || 0;
  const [renderCount, setRenderCount] = useState(startingCountNumber);

  useEffect(() => {
    console.log('Component mounted');
    setRenderCount((prevCount) => prevCount + 1);
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  return (
    <>
      <div className="header">useEffect Demo</div>
      <p>Render Count: {renderCount}</p>
    </>
  );
};

export default UseEffectDemo;
