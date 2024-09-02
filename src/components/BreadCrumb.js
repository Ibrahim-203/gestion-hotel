import React from 'react';

const Breadcrumb = (props) => {
    return (
        <>
        <ul className="breadcrumb">
            <li className="breadcrumb-item active">{props.name}</li>
        </ul>
        </>
    );
};

export default Breadcrumb;