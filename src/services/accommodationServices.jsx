import axios from "axios";

//get token
const token = sessionStorage.getItem('token_bookings')

// get accommodation
const getAccommodations = async () => {
    try{

        const response = await axios.get("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodations", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });        
        return response.data;
    }catch(error){
        console.error("Error al obtener los alojamientos", error);
    }
}

// Create Accommodation
const createAccommodation = async (accommodationData) => {
    try {
        const response = await axios.post("https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation", 
            accommodationData, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            }
        );
      

        return response.data;
    } catch (error) {
        console.error("Error al crear el alojamiento", error);
        throw error; 
    }
};

const updateAccommodation = async (id, accommodationData) => {
    try{
        const response = await  axios.put(`https://apibookingsaccomodations-production.up.railway.app/api/V1/accomodation/${id}`,
         accommodationData,
        { headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
         }
        }
        )
        return response.data

    }catch(error){
        console.error("Error al crear el alojamiento", error);
        throw error; 
    }

}




export { getAccommodations, createAccommodation, updateAccommodation }


