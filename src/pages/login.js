import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [inProgress, setInProgress] = useState(false);

  const updateUser = (e) => {
    const { name, value } = e.target;
    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      setInProgress(true);
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      });
      const data = await res.json();
      if (res.status !== 200) throw new Error(data.error);
      setUser({
        email: "",
        password: "",
      });
      router.push("/");
    } catch (error) {
      console.log(1, error);
      toast.error(error.message);
    } finally {
      setInProgress(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center  px-4 py-16 sm:px-6 lg:px-8 my-2">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Image
              width={320}
              height={80}
              className="mx-auto h-12 w-auto"
              src="/5.png"
              alt="Your Company"
            />
            <h2 className="mt-12 text-center text-3xl font-bold tracking-tight text-gray-900">
              Log In to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submitUser} method="POST">
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  value={user.email}
                  onChange={updateUser}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:outline-none relative block w-full rounded-t-md border-0 py-4 px-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  value={user.password}
                  onChange={updateUser}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="focus:outline-none relative block w-full rounded-b-md border-0 py-4 px-2 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                disabled={!user.email || !user.password || inProgress}
                type="submit"
                className="mt-2 group relative flex w-full disabled:cursor-not-allowed justify-center rounded-md bg-green-600 py-4 px-2  text-md font-semibold text-white hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-green-300"
              >
                {!inProgress ? "Log In" : "Logging In..."}
              </button>
            </div>
          </form>

          <div className="text-center text-sm">
            <p>
              <span className="font-mono font-bold">username:</span>
              <span className="font-mono">admin@sharkk.com</span>
            </p>
            <p>
              <span className="font-mono font-bold">password:</span>
              <span className="font-mono">admin</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
