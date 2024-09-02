import React from 'react';
import SideBar from '../components/Sidebar';

const Book = () => {
    return (
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />

            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <h1 className="mt-5 blank_title">Réservation</h1> </div>
                </div>
            </div>
        </div>
    );
};

export default Book;