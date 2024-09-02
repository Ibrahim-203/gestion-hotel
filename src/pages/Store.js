import React from 'react';
import SideBar from '../components/Sidebar';

const Store = () => (
    <div>
        <div className="main-wrapper">
            {/* Sidebar */}
            <SideBar />
            <div class="page-wrapper">
                <div class="content container-fluid">
                    <div class="page-header">
                        <h1 class="mt-5 blank_title">Espace vente</h1> </div>
                </div>
            </div>
        </div>
    </div>
);

export default Store;