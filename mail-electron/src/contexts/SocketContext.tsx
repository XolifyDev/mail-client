import { createContext, ReactNode, useState } from "react";
import { io, Socket } from 'socket.io-client';

const socketfirst = io('http://localhost:3000');
// const socketfirst = io('https://socket-api.xolify.store/socket.api');

export const SocketContext = createContext(socketfirst);


export const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket>(socketfirst);

    return (
        <SocketContext.Provider value={socket} >
            { children }
        </SocketContext.Provider>
    )
}