import { useState } from "react";
import { Link } from 'react-router-dom';
import { auth, db } from '../../firebaseConnection';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (name !== '' && email !== '' && password !== '') {

      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
          let uid = value.user.uid;
        
          updateProfile(auth.currentUser, {
            displayName: name
          })
       
          let data={
            nome: name,
            createdAt: new Date(),
          }
         await setDoc(doc(db,'users', uid),data)
       
          .then(()=>{
            navigate('/admin', { replace: true })
          })
        }).catch((err) => {
          if (err.code === 'auth/email-already-in-use'){
            toast.warn('Atenção! Email já está em uso.');
            return;
          }
          if(err.code === 'auth/invalid-email'){
            toast.warn('Atenção! Email inválido.');
            return;
          }

          toast.error('Erro ao fazer o cadastro!');
         
        })

    } else {
      toast.warn('Preencha todos os campos!');
    }
  }
  return (
    <div className="home-container">
      <div className="container-form">
        <h1>Cadastre-se</h1>
        <span>Vamos criar sua conta.</span>

        <form className="form" onSubmit={handleRegister}>
        <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome" />

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
          <button type="submit">Cadastrar</button>
        </form>

        <Link className="button-link" to='/'>
          Já possui uma conta? Faça login !
        </Link>
      </div>
    </div>
  )
}