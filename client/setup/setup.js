const serverUrl = 'http://localhost:3000'

const serverApi = axios.create({
  baseURL: `${serverUrl}`
});

function SWAL (type, message) {
  Swal.fire({
    position: 'center',
    type: type,
    title: message,
    showConfirmButton: false,
    timer: 1500
  })
};