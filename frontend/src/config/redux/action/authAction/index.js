import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (!response.data.token) {
                return thunkAPI.rejectWithValue({
                    message: "Token not provided"
                });
            }

            localStorage.setItem("token", response.data.token);

            return response.data.token;

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message || "Something went wrong"
                }
            );
        }
    }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: err.message || "Something went wrong",
        }
      );
    }
  }
);