import React, {useState, useEffect} from 'react'
import {db} from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const Formulario = () => {
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [cedula, setCedula] = useState('')
    const [ciudad, setCiudad] = useState('')
    const [direccion, setDir] = useState('')
    const [correo, setCorreo] = useState('')
    const [asunto, setAsunto] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [lista_solicitudes, setLista_sol] = useState([])
    const [modoEdicion, setModoEdicion] = useState(false)
    const [id, setId] = useState('')
    
    
    useEffect(()=>{
        const obtenerDatos = async () => {
            try{
                await onSnapshot(collection(db, "solicitudes"), (query)=>{
                    setLista_sol(query.docs.map((doc)=>({...doc.data(), id:doc.id})))
                })
            }catch(error){
                console.log(error)
            }
        }
        obtenerDatos();
    }, [])

    const eliminar = async id =>{
        try{
            await deleteDoc(doc(db, 'solicitudes', id))
        }catch(error){
            console.log(error)
        }
    }

    const guardar_sol = async (e) => {
        e.preventDefault()
        try{
            const data = await addDoc(collection(db, 'solicitudes'),{
                Nombre:nombre,
                Apellido:apellido,
                Cedula:cedula,
                Ciudad:ciudad,
                Direccion:direccion,
                Correo:correo,
                Asunto:asunto,
                nombreDescripcion: descripcion
            })
            setLista_sol([
                ...lista_solicitudes,
                {Cedula:cedula, Apellido:apellido, Asunto:asunto, nombreDescripcion: descripcion, id:data.id}
            ])

            setNombre('')
            setApellido('')
            setCedula('')
            setCiudad('')
            setDir('')
            setCorreo('')
            setAsunto('')
            setDescripcion('')

        }catch(error){
            console.log(error)
        }
    }

    const editarDatos = async (e) => {
        e.preventDefault()
        try{
            const docRef = doc(db, 'solicitudes', id);
            await updateDoc(docRef, {
                Nombre:nombre,
                Apellido:apellido,
                Cedula:cedula,
                Ciudad:ciudad,
                Direccion:direccion,
                Correo:correo,
                Asunto:asunto,
                nombreDescripcion: descripcion
            })

            const nuevoArray = lista_solicitudes.map(
                item => item.id === id ? {id: id, Nombre:nombre,
                    Apellido:apellido,
                    Cedula:cedula,
                    Ciudad:ciudad,
                    Direccion:direccion,
                    Correo:correo,
                    Asunto:asunto,
                    nombreDescripcion: descripcion} : item
            )
            
            setLista_sol(nuevoArray)
            setNombre('')
            setApellido('')
            setCedula('')
            setCiudad('')
            setDir('')
            setCorreo('')
            setAsunto('')
            setDescripcion('')
            setId('')
            setModoEdicion(false)

        }catch(error){
            console.log(error)
        }
    }

    const editar = item =>{
        setNombre(item.Nombre)
        setApellido(item.Apellido)
        setCedula(item.Cedula)
        setCiudad(item.Ciudad)
        setDir(item.Direccion)
        setCorreo(item.Correo)
        setAsunto(item.Asunto)
        setDescripcion(item.nombreDescripcion)
        setId(item.id)
        setModoEdicion(true)
    }

    const cancelar = () =>{
        setModoEdicion(false)
        setNombre('')
        setApellido('')
        setCedula('')
        setCiudad('')
        setDir('')
        setCorreo('')
        setAsunto('')
        setDescripcion('')
        setId('')
    }


  return (
    <div className='container mt-5'>
        <h1 className='text-center'>Help Desk!</h1>
        <hr/>
        <div className="row">
            <div className="col-4">
            <h4 className="text-center">
                {
                    modoEdicion ? 'Editar Solicitud' : 'Nueva Solicitud'
                }
            </h4>
            <form onSubmit={modoEdicion ? editarDatos : guardar_sol}>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Nombre'
                value={nombre}
                onChange={(e)=>setNombre(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Apellido'
                value={apellido}
                onChange={(e)=>setApellido(e.target.value)}/>
                <input type="number" min={1000000}
                className="form-control mb-2" 
                placeholder='C.C.'
                value={cedula}
                onChange={(e)=>setCedula(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Ciudad'
                value={ciudad}
                onChange={(e)=>setCiudad(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Dirección'
                value={direccion}
                onChange={(e)=>setDir(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Correo'
                value={correo}
                onChange={(e)=>setCorreo(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Asunto'
                value={asunto}
                onChange={(e)=>setAsunto(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Ingrese Descripción'
                value={descripcion}
                onChange={(e)=>setDescripcion(e.target.value)}/>
                {
                    modoEdicion ?
                    (
                        <>
                            <button
                            className='btn btn-warning btn-block'
                            on='submit'>Editar</button>
                            <button
                            className='btn btn-dark btn-block mx-2'
                            onClick={()=>cancelar()}>Cancelar</button>
                        </>
                    )
                    :
                    
                    <button 
                    type='submit'
                    className='btn btn-primary btn-block'>
                    Registrar
                    </button>
                }
            </form>
            </div>
            <div className="col-8">
                <h4 className="text-center">Lista de Solicitudes</h4>
                <ul className="list-group">
                    {
                        lista_solicitudes.map(item => (
                            <li className="list-group-item" key={item.id}>
                                <span className="lead">{item.nombreFruta}-{item.nombreDescripcion}</span>
                                <button
                                className="btn btn-danger btn-sm float-end mx-2" onClick={()=>eliminar(item.id)}>Eliminar</button>
                                <button className="btn btn-warning btn-sm float-end" onClick={()=>editar(item)}
                                >Editar</button>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Formulario