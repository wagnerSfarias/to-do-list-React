import React, { useState, useEffect } from 'react';
import './index.css'
import { auth, db } from '../../firebaseConnection';
import { signOut } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { FaPen } from "react-icons/fa";
import { FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

export default function Admin() {

  const [taskInput, setInputTask] = useState('');
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [edit, setEdit] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      const userDetail = localStorage.getItem('@detailUser');
      setUser(JSON.parse(userDetail));

      if(userDetail) {
        const data = JSON.parse(userDetail)

        const tarefaRef = collection(db, 'tarefas')
        const q = query(tarefaRef, orderBy('created', 'desc'), where('userUid', '==', data?.uid))
    
        onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid
            })
          })
          setTasks(lista);
        })
      }
    }

    loadTasks();
  }, [])

  async function handleRegister(e) {
    e.preventDefault();

    if (taskInput === '') {
      toast.warn('Digite sua tarefa...');
      return;
    }

    if (edit?.id) {
      handleUpadateTarefa();
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: taskInput,
      created: new Date(),
      userUid: user?.uid
    })
      .then(() => {
        setInputTask('');
        toast.success('Tarefa adicionada');
      })
      .catch(() => {
        toast.error('Erro ao registrar');
      })
  }

  async function handleLogout() {
    await signOut(auth);
    localStorage.removeItem('@detailUser');
  }

  async function deleteTarefa(id) {
    const docRef = doc(db, 'tarefas', id);
    await deleteDoc(docRef);
  }

  function editTasks(item) {
    setInputTask(item.tarefa);
    setEdit(item);
  }

  async function handleUpadateTarefa() {
    const docRef = doc(db, 'tarefas', edit?.id)
    await updateDoc(docRef, {
      tarefa: taskInput
    })
      .then(() => {
        toast.success('Tarefa Atualizada');
        setInputTask('');
        setEdit({});
      })
      .catch(() => {
        toast.error('Erro ao atualizar');
        setInputTask('');
        setEdit({});
      })

  }

  function handleModal(){
    setShowModal(!showModal)
  }

  return (

    <div className='container'>
      <div className='admin-container'>
        <h1>Minhas Tarefas</h1>
        <form className='form' onSubmit={handleRegister}>
          <textarea
            placeholder='Digite sua tarefa....'
            value={taskInput}
            maxLength='40'
            onChange={(e) => setInputTask(e.target.value)}
          />

          {Object.keys(edit).length > 0 ? (
            <button className='btn-register' style={{ backgroundColor: '#6add39' }} type='submit'>Atualizar Tarefa</button>
          ) : (
            <button className='btn-register' type='submit'>Registrar Tarefa</button>
          )}
        </form>

        {tasks.map((item) => (
          <article className='list' key={item.id}>

            <div>
              <button className='btn-edit' onClick={() => editTasks(item)}><FaPen /></button>

               <p>{item.tarefa}</p>

              <button className='btn-delete' onClick={() => deleteTarefa(item.id)}>Concluir</button>
            </div>

            <div className='split'></div>

          </article>

        ))}
        <button className='btn-logout' onClick={handleLogout}><FiLogOut color='#FFF' /></button>
        <button className='btn-user' onClick={handleModal}><FiUser color='#FFF' /></button>

      </div>
      {showModal && (
      <Modal
        data={user}
        close={handleModal}
      />
    )}
    </div>
    
  );
}