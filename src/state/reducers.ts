import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { APIURL } from "../constants";
const APIURL = "https://food-ordering-app-backend.herokuapp.com";

interface ILoginInitialState {
  id: string;
  mobileNumber: string;
  otp: string;
  status: string;
  otpSendStatus: string;
  otpBufferTime: number;
  email: string;
  name: string;
  otpVerifyStatus: string;
  role?: string;
}

const loginInitialState: ILoginInitialState = {
  id: "",
  mobileNumber: "",
  otp: "",
  status: "",
  otpSendStatus: "not-sent",
  otpBufferTime: 0,
  email: "",
  name: "",
  otpVerifyStatus: "not-started",
  role: "",
};

export const sendOtp = createAsyncThunk(
  "sendOtp",
  async (
    data: {
      mobileNumber: string;
    },
    thunkAPI
  ) => {
    try {
      let user = null;
      // TODO : create a service to send otp
      try {
        console.log("login-user");
        const res = await fetch(`${APIURL}/api/users/login-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: data.mobileNumber,
          }),
        });

        const resData = await res.json();
        user = resData;
      } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
      }

      try {
        await fetch(`${APIURL}/api/users/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobileNumber: data.mobileNumber,
          }),
        });
      } catch (error: any) {
        throw new Error(error.message);
      }

      thunkAPI.dispatch(setLoginmobileNumber(data.mobileNumber));
      thunkAPI.dispatch(setLoginUserId(user.id));
      thunkAPI.dispatch(setLoginUserRole(user.role));
      thunkAPI.dispatch(setOtpBufferTime(60));

      return { status: "success" };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async (
    data: {
      mobileNumber: string;
      otp: string;
    },
    thunkAPI
  ) => {
    try {
      const res = await fetch(`${APIURL}/api/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobileNumber: data.mobileNumber,
          otp: data.otp,
        }),
      });

      const resData = await res.json();
      if (resData.message === "Invalid OTP") {
        throw new Error("Invalid OTP");
      }

      if (resData.message === "OTP verified successfully") {
        thunkAPI.dispatch(setLoginStatus("success"));
      }
      return { status: "success" };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const loginSlice = createSlice({
  name: "SET_LOGIN_PHONE_NUMBER",
  initialState: loginInitialState,
  reducers: {
    setLoginmobileNumber: (state, action) => {
      return { ...state, mobileNumber: action.payload };
    },
    setLoginOtp: (state, action) => {
      return { ...state, otp: action.payload };
    },
    setLoginUserId: (state, action) => {
      return { ...state, id: action.payload };
    },
    setLoginStatus: (state, action) => {
      return { ...state, status: action.payload };
    },
    setLoginUserRole: (state, action) => {
      return { ...state, role: action.payload };
    },
    setOtpBufferTime: (state, action) => {
      return { ...state, otpBufferTime: action.payload };
    },
    setEmail: (state, action) => {
      return { ...state, email: action.payload };
    },
    setName: (state, action) => {
      return { ...state, name: action.payload };
    },
    resetOtpVerifyStatus: (state) => {
      return { ...state, otpVerifyStatus: "not-started" };
    },
    logout: (state) => {
      return { ...state, 
        id: "",
        mobileNumber: "",
        otp: "",
        status: "",
        otpSendStatus: "not-sent",
        otpBufferTime: 0,
        email: "",
        name: "",
        otpVerifyStatus: "not-started",
      };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(sendOtp.pending, (state, action) => {
      return { ...state, otpSendStatus: "pending" };
    });
    builder.addCase(sendOtp.fulfilled, (state, action) => {
      return { ...state, otpSendStatus: "success" };
    });
    builder.addCase(sendOtp.rejected, (state, action) => {
      return { ...state, otpSendStatus: "failed" };
    });
    builder.addCase(verifyOtp.pending, (state, action) => {
      return { ...state, otpVerifyStatus: "pending" };
    });
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      return { ...state, otpVerifyStatus: "success" };
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      return { ...state, otpVerifyStatus: "failed" };
    });
  },
});

export const {
  setLoginmobileNumber,
  setLoginOtp,
  setLoginUserId,
  setLoginStatus,
  setOtpBufferTime,
  setEmail,
  setName,
  resetOtpVerifyStatus,
  setLoginUserRole,
  logout
} = loginSlice.actions;
export const loginReducer = loginSlice.reducer;
