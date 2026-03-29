import { useEffect } from 'react'
import './App.css'
import { AppBar } from './Components/Layouts/AppBar';
import { Home } from './Components/Pages/Home';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './Components/Pages/Login';
import { Logout } from './Components/Pages/Logout';
import { Books } from './Components/Pages/Books';
import { Register } from './Components/Pages/Register';
import { BookForm } from './Components/Pages/BookForm'; 
import { BookDetails } from './Components/Pages/BookDetails';
import { setNavigator } from './Services/navigatorService';
import { AuthProvider } from './Components/Contexts/auth/authProvider';
import { Authors } from './Components/Pages/Authors';
import { AuthorForm } from './Components/Pages/AuthorForm';
import { PublisherForm } from './Components/Pages/PublisherForm';
import Publishers from './Components/Pages/Publishers';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);


  return (
    <>
     <AuthProvider>
        <AppBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Books' element={<Books />} />
          <Route path='/book-form' element={<BookForm />} />
          <Route path='/book-form/:id' element={<BookForm />} />
          <Route path="/book-details/:id" element={<BookDetails />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Logout' element={<Logout />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/add" element={<AuthorForm />} />
          <Route path="/authors/edit/:id" element={<AuthorForm />} />
          <Route path="/publishers" element={<Publishers />} />
         <Route path="/publishers/add" element={<PublisherForm />} />
          <Route path="/publishers/edit/:id" element={<PublisherForm />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App