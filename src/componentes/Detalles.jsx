import React from 'react'
import {Carta} from './Carta'
import './Formas.css'

export const Detalles = ({results}) => {
    return (
        <div className='container'>
            <ul className='cartas'>
                {
                    results.map( p=>(
                        <li className='item' key={p.name}>
                            <Carta url={p.url}/>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}