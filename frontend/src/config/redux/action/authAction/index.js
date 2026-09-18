import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { create } from "axios";


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

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async(user, thunkAPI) => {
    try {

      const response = await clientServer.get("/get_user_and_profile", {
        params: {
          token: user.token
        }
      })

      return thunkAPI.fulfillWithValue(response.data)

    } catch(err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
)

export const getAllUser = createAsyncThunk(
  "user/getAllUsers",
  async(_, thunkAPI) => {
    try {

      const response = await clientServer.get("/user/get_all_users")

      return thunkAPI.fulfillWithValue(response.data);

    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
) 

export const createPost = createAsyncThunk(
  "post/createPost",
  async (usereData, thunkAPI) => {
    const {file, body} = usereData;

    try {
        const formData = new FormData();

        formData.append('token', localStorage.getItem('token'));
        formData.append('body', body)
        formData.append('media', file);

        const response = await clientServer.post("/post", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if(response.status === 200) {
          return thunkAPI.fulfillWithValue("Post Uploaded")
        } else {
          return thunkAPI.rejectWithValue("Post not uploaded")
        }


    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)