import React from 'react';

export const showErrorMessage = (msg) => {
    return <div className="nes-badge">
        <span className="is-error">{msg}!</span>
    </div>
}

export const showSuccessMessage = (msg) => {
    return <div className="nes-badge">
        <span className="is-success">{msg}!</span>
    </div>
}
export const showSuccessRegisterMessage = (msg) => {
    return <div className="nes-badge is-success-register">
        <span className="is-success ">{msg}!</span>
    </div>
}