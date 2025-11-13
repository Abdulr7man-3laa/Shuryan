import apiClient from '../client';


export default class Prescriptions {
    static async getPrescriptions(params = {}) {
        const response = await apiClient.get('/Prescriptions/medications', { params });
        return response.data;
    }
}