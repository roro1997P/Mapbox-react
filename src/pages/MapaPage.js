 import React, { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -58.5624,
    lat: -34.6811,
    zoom: 14.72
};
   
export const MapaPage = () => {

   const { setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion } = useMapbox( puntoInicial );
   const { socket } = useContext( SocketContext );

   useEffect( () => {
        socket.on('marcadores-activos', (marcadores) => {
            for ( const key of Object.keys( marcadores ) ) {
                agregarMarcador( marcadores[key], key );
            }
        });
   }, [ socket, agregarMarcador ]);

   useEffect( () => {
        nuevoMarcador$.subscribe( marcador => {
            socket.emit('marcador-nuevo', marcador );
        });
   }, [ nuevoMarcador$, socket ] );

   useEffect( () => {
        movimientoMarcador$.subscribe( marcador => {
            socket.emit('marcador-actualizado', marcador );
        });
    }, [ movimientoMarcador$, socket ] );

    useEffect( () => {
        socket.on('marcador-actualizado', ( marcador ) => {
            actualizarPosicion( marcador );
        });
    }, [ socket, actualizarPosicion ]);

    useEffect( () => {
        socket.on('marcador-nuevo', ( marcador ) => {
            agregarMarcador(marcador, marcador.id );
        });
    }, [ socket, agregarMarcador ]);

    return (
        <>
            <div className="info">
                Lng: { coords.lng } | Lat: { coords.lat } | zoom: { coords.zoom }
            </div>

            <div 
                className="mapContainer"
                ref={ setRef }
            />

        </>
    )
}
