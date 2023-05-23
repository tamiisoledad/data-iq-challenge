/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const getUsers = localStorage.getItem('usuarios')
    const users = JSON.parse(getUsers);

    const userFound = users.find((u) => u.id === +id);

    setUser(userFound);
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [id])

  return (
    <div className="bg-dark profile">
      <div onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></div>
      {!user || loading ? <div className="loading"><ReactLoading type={'bubbles'} color={'white'} height={'40%'} width={'40%'}/></div> : <div className="container">
        <div className="img">
          <img src={user.images} alt='profile'/>
        </div>
        <div className="info">
          <h1>{user.name}</h1>
          <h3><i className="fa-solid fa-at"></i> {user.username}</h3>
          <div className="box">
            <h5>Contacto:</h5>
            <ul>
              <li><i className="fa-regular fa-envelope"></i> {user.email}</li>
              <li><i className="fa-solid fa-mobile-screen"></i> {user.phone}</li>
            </ul>
          </div>
          <div>
            <h5>Empresa:</h5>
            <ul>
             <li><i className="fa-solid fa-building"></i> {user.company.name}</li>
             <p>{user.company.catchPhrase}</p>
            </ul>
          </div>
          <div>
            <h5>Direccion:</h5>
            <iframe
              width="100%"
              height="350"
              frameBorder="0"
              style={{border: 0}}
              title='Geolocalizacion'
              src={`https://maps.google.com/maps?q=${user.address.geo.lat},${user.address.geo.lng}&z=8&output=embed&key=${process.env.REACT_APP_API_KEY_MAP}`}
              allowFullScreen></iframe>
            <p>{user.address.suite}, {user.address.street}, {user.address.city}</p>
          </div>
        </div>
      </div>
    }
  </div>
  );
}

export default Profile;
