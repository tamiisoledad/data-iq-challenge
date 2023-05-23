import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import { Button, Card, Container, Form, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Home.css';
import { useNavigate } from "react-router-dom";
const { getGender } = require('gender-detection-from-name');

const Home = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUsers = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();

    const res = await fetch(`https://randomuser.me/api/?results=${data.length * 4}`)
    const { results } = await res.json();
    const usedImages = [];
    const usersWithImages = [];

    for (const u of data) {
      const names = u.name.toLowerCase().split(' ')
      const name = names[0].includes('.') ? names[1] : names[0]
      const gender = getGender(name)
      const image = results.find((result) => gender === result.gender && !usedImages.includes(result.picture.large));
      const user = {
        ...u,
        images: image.picture.large
      }

      usedImages.push(image.picture.large);
      usersWithImages.push(user);
    }

    setUsers(usersWithImages);
    localStorage.setItem("usuarios", JSON.stringify(usersWithImages));
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const onChange = (e) => {
    setFilter(e.target.value);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filterUsers = () => {
    if (!filter) return setFilteredUsers(users);

    const newUsers = users.filter((user) => {
      if (user.name.toLowerCase().includes(filter) || user.email.toLowerCase().includes(filter) || user.address.city.toLowerCase().includes(filter)) {
        return true;
      }

      return false
    })

    return setFilteredUsers(newUsers);
  }

  useEffect(() => {
    const prevUsers = localStorage.getItem('usuarios');

    if (prevUsers) {
      setUsers(JSON.parse(prevUsers))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      getUsers();
    }
  }, []);

  useEffect(() => {
    filterUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, users]);

  return (
    <div>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant="dark">
        <Container>
          <Navbar.Brand>Usuarios</Navbar.Brand>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder='Buscar usuario'
              className="me-2"
              aria-label="Search"
              onChange={onChange}
            />
            <Button variant="outline-secondary">
              Buscar
            </Button>
          </Form>
        </Container>
      </Navbar>
      {loading ? <div className="loading"><ReactLoading type={'bubbles'} color={'dark'} height={'40%'} width={'40%'}/></div> : null}
      <div className="cards">
        {filteredUsers.length && !loading ? filteredUsers.map((user) => (
          <Card key={user.id} style={{ width: '18rem' }}>
          <Card.Img variant="top" src={user.images} />
          <Card.Body>
            <Card.Title>
              {user.name}
            </Card.Title>
            <ul>
              <li>Username: {user.username}</li>
              <li>Email: {user.email}</li>
              <li>Ciudad: {user.address.city}</li>
              <li>Telefono: {user.phone}</li>
              <li>Empresa: {user.company.name}</li>
            </ul>
            <Card.Footer>
              <Button variant="secondary" onClick={() => navigate(`/${user.id}`)}>Ver más</Button>
            </Card.Footer>
          </Card.Body>
          </Card>
        )) : null}
      </div>
    </div>
  );
}

export default Home;
