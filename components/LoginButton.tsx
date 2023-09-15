import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className="mt-8 sm:w-full lg:min-w-[500px] cursor-pointer text-center select-none items-center gap-2 rounded-md py-5 px-3 text-lg font-semibold leading-3 text-white bg-black transition-colors duration-200 hover:bg-gray-500/10"
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};

export default LoginButton;
