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
                await onSnapshot(collection(db, "nuevo_prod"), (query)=>{
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
            await deleteDoc(doc(db, 'nuevo_prod', id))
        }catch(error){
            console.log(error)
        }
    }

    const guardar_sol = async (e) => {
        e.preventDefault()
        try{
            const data = await addDoc(collection(db, 'nuevo_prod'),{
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
                {   Nombre: nombre,
                    Apellido: apellido,
                    Cedula: cedula,
                    Ciudad: ciudad,
                    Direccion: direccion,
                    Correo: correo,
                    Asunto: asunto,
                    nombreDescripcion: descripcion,
                    id:data.id}
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
            const docRef = doc(db, 'nuevo_prod', id);
            await updateDoc(docRef, {
                Nombre: nombre,
                Apellido: apellido,
                Cedula: cedula,
                Ciudad: ciudad,
                Direccion: direccion,
                Correo: correo,
                Asunto: asunto,
                nombreDescripcion: descripcion
            })

            const nuevoArray = lista_solicitudes.map(
                item => item.id === id ? {id: id, Nombre:nombre,
                    Apellido: apellido,
                    Cedula: cedula,
                    Ciudad: ciudad,
                    Direccion: direccion,
                    Correo: correo,
                    Asunto: asunto,
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

    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

  return (
    <div className='container mt-5'>
        <h1 className='text-center titulos'>Registro Tienda</h1>
        <hr/>
        <div className="row">
            <div className="col-4">
            <h4 className="text-center titulos">
                {
                    modoEdicion ? 'Editar Solicitud' : 'Nuevo Producto'
                }
            </h4>
            <form onSubmit={modoEdicion ? editarDatos : guardar_sol}>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Nombre de producto' required
                value={nombre}
                onChange={(e)=>setNombre(e.target.value)}/>
                {/* <input type="text" 
                className="form-control mb-2" 
                placeholder='Apellido' required
                value={apellido}
                onChange={(e)=>setApellido(e.target.value)}/> */}
                <input type="number"
                className="form-control mb-2" 
                placeholder='Código de producto' required
                value={cedula}
                onChange={(e)=>setCedula(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Ciudad de origen' required
                value={ciudad}
                onChange={(e)=>setCiudad(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Distribuidor' required
                value={direccion}
                onChange={(e)=>setDir(e.target.value)}/>
                <input type="email" 
                className="form-control mb-2" 
                placeholder='Correo' required
                value={correo}
                onChange={(e)=>setCorreo(e.target.value)}/>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Stock' required
                value={asunto}
                onChange={(e)=>setAsunto(e.target.value)}/>
                <textarea className="form-control mb-2" rows="5" placeholder='Agregar anotación' maxlength="500"
                value={descripcion} required
                onChange={(e)=>setDescripcion(e.target.value)}></textarea>
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
                    className='btn btn-primary btn-block botonsu'>
                    Registrar
                    </button>
                }
            </form>
            </div>
            <div className="col-8">
                <h4 className="text-center titulos">Lista Productos</h4>
                <ul className="list-group">
                    {
                        lista_solicitudes.map(item => (
                            <li className="list-group-item" key={item.id}>
                                <span className="lead">{item.Cedula} - {item.Nombre} - {item.Direccion} - {item.Asunto}</span>
                                {/* <img src={"https://picsum.photos/id/"+aleatorio(30,999)+"/200/300"} className='ima' alt='Vista imagen'/> */}

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