import { Dispatch, SetStateAction } from 'react';

const LeftOverlayContent = ({
  isAnimated,
  setIsAnimated,
}: {
  isAnimated: boolean;
  setIsAnimated: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="p-8 text-center">
      <div className="p-8 flex-1 mx-auto overflow-hidden">
        <h1 className="text-6xl font-bold text-white mb-4">
          Already have an account ?
        </h1>

        <h5 className="text-xl text-white">
          Sign in with your email and password
        </h5>
        <div className="mt-16">
          <button
            className="py-3 px-6 bg-transparent rounded-full text-center text-white text-xl font-bold uppercase ring-2 ring-white active:scale-110 transition-transform ease-in"
            // eslint-disable-next-line unused-imports/no-unused-vars
            onClick={(e) => {
              setIsAnimated(!isAnimated);
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftOverlayContent;
