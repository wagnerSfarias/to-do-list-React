import { useState, useEffect } from 'react';
import { auth, db } from '../../firebaseConnection';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './modal.css';

export default function Modal({ data, close }) {
  const [name, setName] = useState(data.name);

  useEffect(() => {

    function loadProfile() {
      const userDetail = localStorage.getItem('@detailUser');

      if (userDetail) {
        const dataUser = JSON.parse(userDetail);

        onSnapshot(doc(db, "users", dataUser.uid), (doc) => {

          setName(doc.data().nome);
          const userData = {
            uid: dataUser.uid,
            email: dataUser.email,
            name: doc.data().nome
          }

          localStorage.setItem('@detailUser', JSON.stringify(userData));

        });
      }
    }
    loadProfile();

  }, [])

  async function handleUpdate() {
    if (name === '') {
      toast.warn('Preencha o campo vazio!');
      return;
    }

    const docRef = doc(db, 'users', data.uid)
    await updateDoc(docRef, {
      nome: name
    })
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: name
        })
        toast.success('Nome atualizado');
        setName(name);
        const userData = {
          uid: data.uid,
          email: data.email,
          name: name
        }

        localStorage.setItem('@detailUser', JSON.stringify(userData));
        window.location.reload(false);
      })
      .catch(() => {
        toast.error('Erro ao atualizar');
      })
  }

  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX color="#FFF" />
          Voltar
        </button>

        <div>
          <h2>Detalhes do Usuario</h2>

          <div className="form">
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome..." />

            <button onClick={handleUpdate}>Atualizar nome</button>
          </div>

        </div>
      </div>
    </div>
  )
}