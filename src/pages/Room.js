import React, { useState } from 'react';
import SideBar from '../components/Sidebar';
import CustomModal from '../components/CustomModal';


const Room = () => {


	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	function myContent(){
		return <p>Room forms</p>
	}
	
    return (
        <div>
        <div className="main-wrapper">
        {/* SideBar */}
		<SideBar />
		{/* SideBar */}
		{/* Modal */}
		<CustomModal title="Ajouter une chambre" open={open} handleClose={handleClose} content = {myContent}/>
            <div className="page-wrapper">
			<div className="content container-fluid">
				<div className="page-header">
					<div className="row align-items-center">
						<div className="col">
							<div className="mt-5">
								<h4 className="blank_title float-left mt-2">Les chambres</h4> <a href="#" className="btn btn-primary float-right veiwbutton" onClick={handleOpen}>Ajouter une chambre</a> </div>
						</div>
					</div>
				</div>
			</div>
			<div id="delete_asset" className="modal fade delete-modal" role="dialog">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-body text-center"> <img src="assets/img/sent.png" alt="" width="50" height="46"/>
							<h3 className="delete_class">Are you sure want to delete this Asset?</h3>
							<div className="m-t-20"> <a href="#" className="btn btn-white" data-dismiss="modal">Close</a>
								<button type="submit" className="btn btn-danger">Delete</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
        </div>
        </div>
    );
};

export default Room;