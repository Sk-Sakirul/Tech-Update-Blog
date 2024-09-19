import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import authService from "../appwrite/auth";
import { login } from "../app/authSlice";
import { Button, Input } from ".";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const currentTheme = localStorage.getItem("theme") ?? "light";
  const toastTheme = [
    "light",
    "cupcake",
    "aqua",
    "cyberpunk",
    "wireframe",
  ].includes(currentTheme)
    ? "light"
    : "dark";

  const notifyOnSuccess = () =>
    toast.success("Account Created Successfully", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: toastTheme,
    });

  const notifyOnError = () =>
    toast.error("Something went wrong!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: toastTheme,
    });

  const create = async (data) => {
    setError("");
    setLoading(true);
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login(currentUser));
        document.getElementById("signup").close();
        navigate("/");
        notifyOnSuccess();
      }
    } catch (error) {
      notifyOnError();
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-base-100 rounded-lg"
    >
      <h2 className="text-3xl font-bold text-center mb-6">Create an Account</h2>
      <p className="text-center text-base-content/70 mb-8">
        Already have an account?{" "}
        <button
          className="text-primary hover:underline focus:outline-none"
          onClick={() => {
            document.getElementById("signup").close();
            document.getElementById("login").showModal();
          }}
        >
          Log in
        </button>
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-error/20 text-error p-3 rounded-md mb-6"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(create)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <Input
            type="name"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register("name", {
              required: "Name is required",
            })}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
        </div>

        <Button
          type="submit"
          className="w-full btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-base-content/70">
        By signing up, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </motion.div>
  );
}
