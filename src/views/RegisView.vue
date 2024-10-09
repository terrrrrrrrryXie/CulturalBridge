<template>
  <div class="container">
    <h1>Cultural Bridge</h1>
    <form @submit.prevent="signUp">
      <div class="emailSec mb-3">
        <label for="email" class="form-label">Email address</label>
        <div>
          <input
            type="text"
            :class="['form-control', emailErrMsg == '' ? '' : 'is-invalid']"
            id="email"
            aria-describedby="emailHelp"
            v-model="userInfo.email"
            @blur="validateEmail"
          />
          <button
            type="button"
            class="verify btn btn-outline-primary"
            @click="sendCode"
            :disabled="sended"
          >
            {{ sendButtonText }}
          </button>
        </div>
        <div class="invalid-feedback" v-if="emailErrMsg != ''">
          {{ emailErrMsg }}
        </div>
      </div>

      <div class="mb-3">
        <label for="code" class="form-label">Verification Code</label>
        <input
          type="text"
          :class="['form-control', codeErrMsg == '' ? '' : 'is-invalid']"
          id="code"
          v-model="userInfo.verifyCode"
        />
        <div class="invalid-feedback" v-if="codeErrMsg != ''">
          {{ codeErrMsg }}
        </div>
      </div>

      <div class="mb-3 password">
        <label for="password" class="form-label">Password</label>
        <input
          :type="show ? 'text' : 'password'"
          :class="['form-control', passwdErrMsg == '' ? '' : 'is-invalid']"
          id="password"
          v-model="userInfo.password"
          @blur="validatePasswd"
        />
        <a
          href="#"
          :class="[
            'showPassword',
            'bi',
            show ? 'bi-eye-fill' : 'bi-eye-slash-fill',
          ]"
          @mousedown="showPassword(true)"
          @mouseup="showPassword(false)"
          aria-label="show confirmed password"
        />
        <div class="invalid-feedback" v-if="passwdErrMsg != ''">
          {{ passwdErrMsg }}
        </div>
      </div>
      <div class="mb-3 password">
        <label for="confirmPassword" class="form-label">Confirm Password</label>
        <input
          :type="showConfirm ? 'text' : 'password'"
          :class="[
            'form-control',
            confirPasswdErrMsg == '' ? '' : 'is-invalid',
          ]"
          id="confirmPassword"
          v-model="userInfo.confirmPassword"
          @blur="validateConfirPass"
        />

        <a
          href="#"
          :class="[
            'showPassword',
            'bi',
            showConfirm ? 'bi-eye-fill' : 'bi-eye-slash-fill',
            'is-invalid',
          ]"
          @mousedown="showConfirmPassword(true)"
          @mouseup="showConfirmPassword(false)"
          aria-label="show password"
        />
        <div class="invalid-feedback" v-if="confirPasswdErrMsg != ''">
          {{ confirPasswdErrMsg }}
        </div>
      </div>
      <router-link to="/login" style="display: block; margin-bottom: 1.2vh">
        Already have account?
      </router-link>
      <button type="submit" class="btn btn-primary" style="margin-bottom: 2vh">
        Sign Up
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

// show/hide password
const show = ref(false);
const showPassword = (state) => {
  show.value = state;
};
const showConfirm = ref(false);
const showConfirmPassword = (state) => {
  showConfirm.value = state;
};

const userInfo = ref({
  email: "",
  verifyCode: "",
  password: "",
  confirmPassword: "",
});

// email validation
const emailErrMsg = ref("");
const validateEmail = () => {
  const email = userInfo.value.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    emailErrMsg.value = "Please enter your email";
  } else if (!emailRegex.test(email)) {
    emailErrMsg.value = "Please provide a valid email address.";
  } else if (email.length > 100) {
    emailErrMsg.value = "Email length exceeds limit";
  } else {
    emailErrMsg.value = "";
  }
};

// password validation
const passwdErrMsg = ref("");
const validatePasswd = () => {
  const passwd = userInfo.value.password.trim();
  if (!passwd) {
    passwdErrMsg.value = "Please enter your password";
  } else if (!/[a-z]/.test(passwd)) {
    passwdErrMsg.value = "Password must contain at least 1 lowercase letter";
  } else if (!/[A-Z]/.test(passwd)) {
    passwdErrMsg.value = "Password must contain at least 1 uppercase letter";
  } else if (!/\d/.test(passwd)) {
    passwdErrMsg.value = "Password must contain at least 1 number";
  } else if (!/[!@#$%^&*()/,.?":{}|<>]/.test(passwd)) {
    passwdErrMsg.value = "Password must contain at least 1 special character";
  } else if (!(passwd.length >= 8 && passwd.length <= 16)) {
    passwdErrMsg.value = "Password must be 8-16 characters long";
  } else {
    passwdErrMsg.value = "";
  }
};

// confirm password validation
const confirPasswdErrMsg = ref("");
const validateConfirPass = () => {
  const confirmPasswd = userInfo.value.confirmPassword.trim();
  if (!confirmPasswd) {
    confirPasswdErrMsg.value = "Please enter your password again";
  } else if (confirmPasswd !== userInfo.value.password) {
    confirPasswdErrMsg.value = "Passwords do not match";
  } else if (confirmPasswd.length > 100) {
    confirPasswdErrMsg.value = "Password length exceeds limit";
  } else {
    confirPasswdErrMsg.value = "";
  }
};

// send verification code
const sended = ref(false);
const sendButtonText = ref("Verify");
const generatedCode = ref(0);
const sendCode = async () => {
  validateEmail()
  // ensure email not empty
  if (emailErrMsg.value != '') {
    return
  }
  generatedCode.value = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(generatedCode.value);
  try {
    store.dispatch('sendCode', {email: userInfo.value.email, code: generatedCode.value})
    disableSend()
  } catch (error) {
    console.error("Send code error: ", error);
  }
};

// diabled send button after send code
const disableSend = () => {
  let cooldown = 60;
  sended.value = true;

  const countdown = setInterval(() => {
    cooldown -= 1;
    sendButtonText.value = `${cooldown}s resend`;

    if (cooldown <= 0) {
      clearInterval(countdown);
      sendButtonText.value = "Verify";
      sended.value = false;
    }
  }, 1000);
};

// verification code validation
const codeErrMsg = ref("");
const validateCode = () => {
  const code = userInfo.value.verifyCode.trim();
  if (!(code === generatedCode.value)) {
    codeErrMsg.value = "Incorrect code, please check email";
  } else if (code.length > 100) {
    codeErrMsg.value = "Code length exceeds limit";
  } else {
    codeErrMsg.value = "";
  }
};

const signUp = async () => {
  validateCode();
  if (
    emailErrMsg.value === "" &&
    passwdErrMsg.value === "" &&
    confirPasswdErrMsg.value === "" &&
    codeErrMsg.value === ""
  ) {
    emailErrMsg.value = await store.dispatch("regist", {
      email: userInfo.value.email,
      passwd: userInfo.value.password,
    });
    if (emailErrMsg.value !== "") {
      generatedCode.value = 0;
      return;
    }
    router.push("/");
  } else {
    console.log("fail");
  }
};
</script>

<style scoped>
h1 {
  font-family: "Courier New", Courier, monospace;
  font-weight: bolder;
  text-align: center;
}
.container {
  width: 40vw;
  margin: auto;
  margin-top: 4vh;
}
@media (max-width: 1200px) {
  .container {
    width: 60vw;
  }
}
@media (max-width: 768px) {
  .container {
    width: 80vw;
  }
}
form {
  width: 100%;
  margin-top: 4vh;
}
.btn {
  width: 100%;
}
.password {
  position: relative;
}
.showPassword {
  color: black;
  font-size: 1.6rem;
  position: absolute;
  bottom: 0;
  right: 1.8vw;
}
.emailSec div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
#email,
#code {
  width: 78%;
}
.verify {
  width: 18%;
  font-size: 0.8rem;
  text-align: center;
}

.invalid-feedback {
  position: absolute;
  margin-bottom: 4vh;
}
@media (max-width: 768px) {
  .bi {
    display: none;
  }
}
.mb-3 {
  margin-bottom: 4vh !important;
}
</style>
