import React from 'react';
import { useParams } from 'react-router-dom';

interface LobbyParams {
    gameName: string
}

const Lobby: React.FC = () => {
    const { gameName } = useParams<LobbyParams>();

    return (
    <>
    <h1>{gameName}</h1>
    <p>{gameName} Lobby</p>
    </>
    )
}

export default Lobby;