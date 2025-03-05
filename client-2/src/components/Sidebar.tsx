import styles from "./Sidebar.module.css";
import 'boxicons/css/boxicons.min.css';

export default function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className={`${styles.sidebar} ${styles.locked}`}>

        <div className={styles.nav_brand}>
          <span >
            <img className={styles.nav_logo} src="images/logo.jpg" alt="logo_img" width="250" />
          </span>
      
        </div>

        <div className={styles.menu_container}>

          <div className={styles.menu_items}>
            <ul className={styles.menu_item}>
              <div className={`${styles.menu_title} ${styles.flex}`}>
                <span className={styles.title}>Dashboard</span>
                <span className={styles.line} />
              </div>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-box" />
                  <span>Products</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-home-alt" />
                  <span>Overview</span>
                </a>
              </li>

            </ul>
            <ul className={styles.menu_item}>
              <div className={`${styles.menu_title} ${styles.flex}`}>
                <span className={styles.title}>Editor</span>
                <span className={styles.line} />
              </div>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bxs-magic-wand" />
                  <span>Magic Build</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-folder" />
                  <span>New Projects</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-cloud-upload" />
                  <span>Upload New</span>
                </a>
              </li>
            </ul>
            <ul className={styles.menu_item}>
              <div className={`${styles.menu_title} ${styles.flex}`}>
                <span className={styles.title}>Setting</span>
                <span className={styles.line} />
              </div>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-flag" />
                  <span>Notice Board</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`}>
                  <i className="bx bx-cog" />
                  <span>Setting</span>
                </a>
              </li>
              <li className={styles.item}>
                <a href="#" className={`${styles.link} ${styles.flex}`} onClick={handleLogout}>
                  <i className="bx bx-log-out" />
                  <span>Logout</span>
                </a>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
