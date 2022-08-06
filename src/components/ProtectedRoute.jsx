import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ auth, children }) => {

    if (!auth) {
        return <Navigate to={"/login"} />
    }

    return children
   
}

export default ProtectedRoute