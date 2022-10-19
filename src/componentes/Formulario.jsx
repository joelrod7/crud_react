import React, {useState, useEffect} from 'react'
import {db} from '../firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const Formulario = () => {
    const [fruta, setFruta] = useState('')
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
                await onSnapshot(collection(db, "frutas"), (query)=>{
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
            await deleteDoc(doc(db, 'frutas', id))
        }catch(error){
            console.log(error)
        }
    }

    const guardarFrutas = async (e) => {
        e.preventDefault()
        try{
            const data = await addDoc(collection(db, 'frutas'),{
                nombreFruta:fruta,
                nombreDescripcion: descripcion
            })
            setLista_sol([
                ...lista_solicitudes,
                {nombreFruta: fruta, nombreDescripcion: descripcion, id:data.id}
            ])

            setFruta('')
            setDescripcion('')

        }catch(error){
            console.log(error)
        }
    }

    const editarFrutas = async (e) => {
        e.preventDefault()
        try{
            const docRef = doc(db, 'frutas', id);
            await updateDoc(docRef, {
                nombreFruta:fruta,
                nombreDescripcion:descripcion
            })

            const nuevoArray = lista_solicitudes.map(
                item => item.id === id ? {id: id, nombreFruta:fruta, nombreDescripcion:descripcion} : item
            )
            
            setLista_sol(nuevoArray)
            setFruta('')
            setDescripcion('')
            setId('')
            setModoEdicion(false)

        }catch(error){
            console.log(error)
        }
    }

    const editar = item =>{
        setFruta(item.nombreFruta)
        setDescripcion(item.nombreDescripcion)
        setId(item.id)
        setModoEdicion(true)
    }

    const cancelar = () =>{
        setModoEdicion(false)
        setFruta('')
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
            <form onSubmit={modoEdicion ? editarFrutas : guardarFrutas}>
                <input type="text" 
                className="form-control mb-2" 
                placeholder='Nombre'
                value={fruta}
                onChange={(e)=>setFruta(e.target.value)}/>
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
            
        </div>
    </div>
  )
}

export default Formulario