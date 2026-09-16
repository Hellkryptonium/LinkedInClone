import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllPost = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => {
        try {

            const response = await clientServer.get('/posts');

            return thunkAPI.fulfillWithValue(response.data)

        } catch(err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)