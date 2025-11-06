import React from 'react';

import LoadingIcon from '@/assets/svg/LoadingIcon';

const LoadingSpin: React.FC = () => {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-5 h-5 animate-spin">
        <LoadingIcon />
      </div>
    </div>
  );
};

export default LoadingSpin;