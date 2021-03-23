import axios from 'axios'

const standard = axios.create({
    baseURL: getBaseUrl(),
    timeout: 100000,
    transformResponse: [
        function (data) {
            return data
        }
    ]
})


function getBaseUrl() {
    return 'http://127.0.0.1:8000/';
}

export default standard