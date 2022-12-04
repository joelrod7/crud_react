import { useEffect, useState } from 'react'

export const Conex_Api = (url) => {

    const [resultado, setResultado] = useState ({cargando:true, data:null})

    useEffect( () =>{
        getDatos(url)
    }, [url])

    async function getDatos(url){
        try {
            setResultado({cargando:true,data:null})
            const res = await fetch(url)
            const data = await res.json()
            setResultado({cargando:false, data})

        } catch (error) {
            console.log(error)
        }
    }

    return resultado
}