import apiClient from '../client';

class AuthService {
  async registerPatient(data) {
    const response = await apiClient.post('/Auth/register/patient', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  }

  async registerDoctor(data) {
    const response = await apiClient.post('/Auth/register/doctor', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      medicalSpecialty: data.medicalSpecialty,
    });
    return response.data;
  }

  async registerLaboratory(data) {
    const response = await apiClient.post('/Auth/register/laboratory', {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  }

  async registerPharmacy(data) {
    const response = await apiClient.post('/Auth/register/pharmacy', {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response.data;
  }

  async verifyEmail(email, otpCode) {
    const response = await apiClient.post('/Auth/verify-email', {
      email: email.trim(),
      otpCode: String(otpCode).trim(),
    });
    return response.data;
  }

  async resendVerification(email) {
    const response = await apiClient.post('/Auth/resend-verification', {
      email,
    });
    return response.data;
  }

  async login(email, password) {
    const response = await apiClient.post('/Auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async googleLogin(idToken, userType = null) {
    const response = await apiClient.post('/Auth/google', {
      idToken,
      userType,
    });
    return response.data;
  }

  async forgotPassword(email) {
    const response = await apiClient.post('/Auth/forgot-password', {
      email,
    });
    return response.data;
  }

  async resetPassword(email, otpCode, newPassword, confirmPassword) {
    const response = await apiClient.post('/Auth/reset-password', {
      email: email.trim(),
      otpCode: String(otpCode).trim(),
      newPassword,
      confirmPassword,
    });
    return response.data;
  }

  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    const response = await apiClient.post('/Auth/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  }

  async refreshToken(accessToken, refreshToken) {
    const response = await apiClient.post('/Auth/refresh-token', {
      accessToken,
      refreshToken,
    });
    return response.data;
  }

  async logout(accessToken, refreshToken) {
    const response = await apiClient.post('/Auth/logout', {
      accessToken,
      refreshToken,
    });
    return response.data;
  }
}

export default new AuthService();