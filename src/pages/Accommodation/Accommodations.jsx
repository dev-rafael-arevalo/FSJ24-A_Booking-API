import React, { useEffect, useState } from "react";
import { createAccommodation, getAccommodations, updateAccommodation } from "../../services/accommodationServices";
import { PlusLg } from "react-bootstrap-icons";

import CustomCard from "./Card";
import AccommodationModal from "./AccommodationModal";
import Swal from "sweetalert2";
export default function Accommodations() {
  const [accommodations, setAccommodations] = useState([]);
  //states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccommodationData, setEditingAccommodationData] = useState(null);


  //method to get the response from the api
  const fetchData = async () => {
    try {
      const response = await getAccommodations();
      const token = sessionStorage.getItem('token_bookings');
      if (!token) {
          console.error("No token found. User is not authenticated.");
          setIsLoading(false);
          return; // Detener la ejecución si no hay token
      }
      setAccommodations(response);

    } catch (error) {
      console.error("Error al cargar alojamientos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postData = async (newAcommodation) => {
    try {
      const response = await createAccommodation(newAcommodation);
      console.log(response);
      Swal.fire({
        title: "¡Alojamiento agregado!",
        text: "El nuevo alojamiento se ha agregado exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
        timer: 2000,
      });
      
    } catch (error) {
      console.error("Error al crear la acomodación:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al agregar el alojamiento. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
        timer: 2000,
      });
    } finally {
      setModalOpen(false); // close modal
      await fetchData();
    }
  };
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingAccommodationData(item);
    setModalOpen(true);
    console.log('editing..',item)
  };

  const onClose = () => {
    setModalOpen(false)
    setIsEditing(false)
  }

  const updateData = async (updateData) => {
    // validation id
    if (!editingAccommodationData || !editingAccommodationData.id) {
      console.error("No se puede actualizar: ID de alojamiento no encontrado.");
      return; 
    }
  
    try {
      const response = await updateAccommodation(editingAccommodationData.id, updateData);
      console.log('Accommodation update:', response);
      Swal.fire({
        title: "¡Accommodation update!",
        text: "The new accommodation has been added successfully.",
        icon: "success",
        confirmButtonText: "Accept",
        timer: 2000,
      });
    } catch (error) {
      console.error("error", error);
      Swal.fire({
        title: "Error",
        text: "There was a problem adding the accommodation. Try again.",
        icon: "error",
        confirmButtonText: "Accept",
        timer: 2000,
      });
    } finally {
      setModalOpen(false);
      setIsEditing(false);
      setEditingAccommodationData(null); 
      fetchData();
    }
  };
  useEffect(() => {
    //validation token
    const session_token = sessionStorage.getItem("token_bookings");
    if (session_token) {
      setIsAuthenticated(true);
      //get accommodations 
      fetchData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
 <>

  <div className="w-100 d-flex flex-column flex-md-row justify-content-center align-items-center">
  {isLoading ? (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
  <div className="text-center">
    <div className="spinner-border" role="status"></div>
    <div className="d-flex flex-column">
      <span>Loading...</span>
    </div>
  </div>
</div>
    ) : isAuthenticated ? (
      <div>
    <div className=" d-flex  justify-content-between align-items-center gap-1 mb-4 flex-custom-media">
    <h2 className="d-flex align-items-start col col-lg-9 col-md-8 col-sm-6 width-media">Accommodations</h2>
    <button
      className="d-flex col col-lg-3 justify-content-center col-md-4 col-sm-6  align-items-center gap-2 px-3 rounded-2 width-media"
      onClick={() => setModalOpen(true)}
    >
      <PlusLg size={16} />
      New Accommodation
    </button>
  </div>
        {accommodations.map((item) => (
          <div key={item.id} className="mb-4">
            <CustomCard
              name={item.name}
              direction={item.address}
              description={item.description}
              img={item.image}
              handleEdit={() => handleEdit(item)}
            />
          </div>
        ))}
      </div>
    ) : (
      <h2 className="text-center text-danger">You are not authorized, log in</h2>
    )}
  </div>
  <AccommodationModal
    isOpen={isModalOpen}
    onClose={ onClose}
    onSubmit={(data) => (isEditing ? updateData(data) : postData(data))}
    initialData={isEditing ? editingAccommodationData : null}  
    isEdit={isEditing}
  />
</>

  );
}
