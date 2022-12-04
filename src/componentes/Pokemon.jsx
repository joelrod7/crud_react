import React, {useState} from 'react'
import {Conex_Api} from './Conex_Api'
import {Detalles} from './Detalles'

const Pokemon = () => {
    const [url, setUrl] = useState('https://pokeapi.co/api/v2/pokemon')
    const estado = Conex_Api(url)
    const {cargando, data} = estado


    return(
        <div>
            <h1>Api Pokédex</h1>
            {
                cargando
                ?
                <h2>Cargando...</h2>
                :
                <div>
                    <Detalles results={data.results}/>
                    
                    <div className='parte_baja'>
                        <button className='cambiar' onClick={() =>setUrl(data.previous)}>Prev</button>
                        <button className='cambiar' onClick={() =>setUrl(data.next)}>Next</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Pokemon