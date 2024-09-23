import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {

	const handleLogout = (e)=>{
		e.preventDefault()
		sessionStorage.clear()
		window.location.reload(false)
	}

	const menus = [
		{ title: "Tableau de bord", link: "/", icon: "fas fa-tachometer-alt" },
    {
      title: "Clients",
      link: "/client",
      icon: "fas fa-user",
      spacing: true,
    },
    { title: "Chambres", link: "", icon: "fas fa-key" ,submenu:true, subItems : [
		{title : "Les chambres", sublink:"/room"},
		{title : "Type de chambre", sublink:"/roomType"},
	] },
	{ title: "vente", link: "", icon: "fas fa-store" ,submenu:true, subItems : [
		{title : "Espace vente", sublink:"/store"},
		{title : "Liste vente", sublink:"/listStore"},
	] },
	{ title: "Produit", link: "/product", icon: "fas fa-wine-bottle" },
    { title: "Reservation", link: "/book", icon: "fas fa-book" },
	// { title: "Utilisateurs", link: "", icon: "fas fa-user-plus", submenu:true, subItems : [
	// 	{title : "item1", sublink:"/item1"},
	// 	{title : "item2", sublink:"/item2"},
	// 	{title : "item3", sublink:"/item3"}
	// ] },
	]
	const [subOpen, setSubOpen] = useState(null)
	// update value of sub menu
	const toggleSubmenu = (index) => {
		setSubOpen(index === subOpen ? null : index);
  };
    return (
        <div>
			<div className="header">
			<div className="header-left">
				<a href="/" className="logo"> <img src="assets/img/hotel_logo.jpg" width="50" height="70" alt="logo"/> <span className="logoclass">HOTEL</span> </a>
				<a href="/" className="logo logo-small"> <img src="assets/img/hotel_logo.jpg" alt="Logo" width="30" height="30"/> </a>
			</div>
			<a href="#" id="toggle_btn"> <i className="fe fe-text-align-left"></i> </a>
			<a className="mobile_btn" id="mobile_btn"> <i className="fas fa-bars"></i> </a>
			<ul className="nav user-menu">
				{/* <li className="nav-item dropdown noti-dropdown">
					<a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown"> <i className="fe fe-bell"></i> <span className="badge badge-pill">3</span> </a>
					<div className="dropdown-menu notifications">
						<div className="topnav-dropdown-header"> <span className="notification-title">Notifications</span> <a href="#" className="clear-noti"> Clear All </a> </div>
						<div className="noti-content">
							<ul className="notification-list">
								<li className="notification-message">
									<a href="#">
										<div className="media"> <span className="avatar avatar-sm">
											<img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-02.jpg"/>
											</span>
											<div className="media-body">
												<p className="noti-details"><span className="noti-title">Carlson Tech</span> has approved <span className="noti-title">your estimate</span></p>
												<p className="noti-time"><span className="notification-time">4 mins ago</span> </p>
											</div>
										</div>
									</a>
								</li>
								<li className="notification-message">
									<a href="#">
										<div className="media"> <span className="avatar avatar-sm">
											<img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-11.jpg"/>
											</span>
											<div className="media-body">
												<p className="noti-details"><span className="noti-title">International Software
													Inc</span> has sent you a invoice in the amount of <span className="noti-title">$218</span></p>
												<p className="noti-time"><span className="notification-time">6 mins ago</span> </p>
											</div>
										</div>
									</a>
								</li>
								<li className="notification-message">
									<a href="#">
										<div className="media"> <span className="avatar avatar-sm">
											<img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-17.jpg"/>
											</span>
											<div className="media-body">
												<p className="noti-details"><span className="noti-title">John Hendry</span> sent a cancellation request <span className="noti-title">Apple iPhone
													XR</span></p>
												<p className="noti-time"><span className="notification-time">8 mins ago</span> </p>
											</div>
										</div>
									</a>
								</li>
								<li className="notification-message">
									<a href="#">
										<div className="media"> <span className="avatar avatar-sm">
											<img className="avatar-img rounded-circle" alt="User Image" src="assets/img/profiles/avatar-13.jpg"/>
											</span>
											<div className="media-body">
												<p className="noti-details"><span className="noti-title">Mercury Software
												Inc</span> added a new product <span className="noti-title">Apple
												MacBook Pro</span></p>
												<p className="noti-time"><span className="notification-time">12 mins ago</span> </p>
											</div>
										</div>
									</a>
								</li>
							</ul>
						</div>
						<div className="topnav-dropdown-footer"> <a href="#">View all Notifications</a> </div>
					</div>
				</li> */}
				<li className="nav-item dropdown has-arrow">
					<a href="#" className="dropdown-toggle nav-link" data-toggle="dropdown"> <span className="user-img"><img className="rounded-circle" src="assets/img/profiles/profil.jpg" width="31" alt="utilisateur"/></span> </a>
					<div className="dropdown-menu">
						{/* <div className="user-header">
							<div className="avatar avatar-sm"> <img src="assets/img/profiles/avatar-01.jpg" alt="User Image" className="avatar-img rounded-circle"/> </div>
							<div className="user-text">
								<h6>Soeng Souy</h6>
								<p className="text-muted mb-0">Administrator</p>
							</div>
						</div>  */}
						{/* <a className="dropdown-item" href="profile.html">My Profile</a> <a className="dropdown-item" href="settings.html">Account Settings</a>  */}
						<a className="dropdown-item" href='#' onClick={handleLogout}>Se Deconnecter</a> 
						</div>
				</li>
			</ul>
			<div className="top-nav-search">
				<form>
					<input type="text" className="form-control" placeholder="Recherche"/>
					<button className="btn" type="submit"><i className="fas fa-search"></i></button>
				</form>
			</div>
		</div>
            <div className="sidebar" id="sidebar">
			<div className="sidebar-inner slimscroll">
				<div id="sidebar-menu" className="sidebar-menu">
					<ul>
						{menus.map((menu, index)=>(
						<li className={menu.submenu ? "submenu" : ""} key={index}><NavLink 
						to={!menu.submenu && menu.link} className={({isActive})=>`${subOpen === index ? "subdrop" : ""} ${!menu.submenu && !menu.subItems && isActive ? "active" : ""}`} onClick={()=>{menu.submenu && toggleSubmenu(index)}}><i className={menu.icon }></i> <span>{menu.title}</span>{menu.submenu ? <span className="menu-arrow" ></span> : ""}</NavLink>
						{menu.submenu && (
							<ul className="submenu_class" style={{display:  subOpen==index?"block" : "none"}}>
								{menu.subItems.map((sub,index)=>(
									<li key={index}><NavLink to={sub.sublink}>{sub.title}</NavLink></li>
								))}
							</ul>
						)}
								
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
        </div>
    );
};

export default SideBar;