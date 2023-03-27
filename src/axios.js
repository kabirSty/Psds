// axios
import axios from 'axios'

// const domain = "http://127.0.0.1:8000"
const domain = "https://backend.citiguide.dk"

export default axios.create({
	baseURL : domain
})
