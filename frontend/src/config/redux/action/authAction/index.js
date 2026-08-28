import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {

            const response = await clientServer.post('/login', {
                "email": user.email,
                "password": user.password
            });

            if(response.data.token) {
                if (typeof window !== "undefined") {
                    const token = localStorage.getItem("token");
                }
            } else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || {
                    message: error.message || "Something went wrong"
                }
            );
        }
    }
)

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {

    }
)