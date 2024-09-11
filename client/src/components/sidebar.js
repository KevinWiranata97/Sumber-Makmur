import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <>
      <aside className="main-sidebar  sidebar-light-primary elevation-4">
        {/* Brand Logo */}
        <div className="d-flex justify-content-center">
          <img
            src="/logo.jpg"
            alt="AdminLTE Logo"
            style={{ opacity: "0.8", width: "90%" }}
          />
        </div>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}

              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="nav-icon fas fa-cubes"></i>
                  <p>Barang</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/units" className="nav-link">
                  <i className="nav-icon fas fa-balance-scale"></i>
                  <p>Satuan</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/storages" className="nav-link">
                  <i className="nav-icon fas fa-warehouse"></i>
                  <p>Gudang</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/areas" className="nav-link">
                <i className="nav-icon fas fa-map-marked-alt"></i>
                  <p>Area</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/expeditions" className="nav-link">
                <i className="nav-icon fas fa-truck"></i>
                  <p>Ekspedisi</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/customers" className="nav-link">
                <i className="nav-icon fas fa-address-book"></i>

                  <p>Customer</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/suppliers" className="nav-link">
                <i className="nav-icon fas fa-handshake "></i>

                  <p>Supplier</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/transactions" className="nav-link">
                <i className="nav-icon fas fa-shopping-cart"></i>


                  <p>Beli Barang</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/transactions" className="nav-link">
                <i className="nav-icon fas fa-money-bill-wave"></i>


                  <p>Jual Barang</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  onClick={() => localStorage.clear()}
                  to="/login"
                  className="nav-link"
                >
                  <i className="nav-icon fa-solid fa-power-off" />
                  <p>Logout</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
}
