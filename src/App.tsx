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
import { ReadBook } from './Components/Pages/ReadBook';
import { VerifyUser } from './Components/Pages/VerifyUser';
import { Users } from "./Components/Pages/Users";
import { UserEditForm } from './Components/Pages/UserEditForm';
import { Categories } from './Components/Pages/Categories';
import { CategoryForm } from './Components/Pages/CategoryForm';
import { Profile } from './Components/Pages/Profile';
import { PaymentPage } from './Components/Pages/PaymentPage';


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
          <Route path='/read-book/:id' element={<ReadBook />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/verify-user/:token' element={<VerifyUser />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Logout' element={<Logout />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/add" element={<AuthorForm />} />
          <Route path="/authors/edit/:id" element={<AuthorForm />} />
          <Route path="/publishers" element={<Publishers />} />
         <Route path="/publishers/add" element={<PublisherForm />} />
          <Route path="/publishers/edit/:id" element={<PublisherForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/edit/:id" element={<UserEditForm />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/add" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
     <Route path="/" element={<Home />} />
  <Route path="/profile" element={<Profile />} />
  
  {/* This MUST match the navigate() path in Profile.tsx */}
  <Route path="/book-details/:id" element={<BookDetails />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App