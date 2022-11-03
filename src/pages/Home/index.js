import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { auth } from '../../firebaseConnection';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { toast } from 'react-toastify';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    function loadUser() {
      const user = localStorage.getItem('@detailUser');

      if (user) {
        navigate('/admin', { replace: true });
        return;
      }

    }
    loadUser();
  }, [])

  async function handleLogin(e) {
    e.preventDefault();

    if (email !== '' && password !== '') {
      await signInWithEmailAndPassword(auth, email, password)
        .then( () => {
          navigate('/admin', { replace: true })
        })
        .catch((err) => {
          if(err.code === 'auth/user-not-found'){
            toast.warn('Email inválido, tente novamente.')
          }
          else if(err.code === 'auth/wrong-password'){
            toast.warn('Senha inválida, tente novamente.')
          }else{
            toast.warn('Verifique email e senha e tente novamente.')
          }
        
        })

    } else {
      toast.warn('Preencha todos os Campos !')
    }
  }
  return (
    <div className="home-container">
      <div className="container-form">

        <h1>Lista de Tarefas</h1>
        <span>Criado para ajudar a gerenciar suas tarefas diarias.</span>

        <form className="form" onSubmit={handleLogin}>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email....." />

          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******" />
          <button type="submit">Acessar</button>
        </form>
        <Link className="button-link" to='/register'>
          Não possui uma conta? Cadastre-se
        </Link>
      </div>
    </div>
  )
}