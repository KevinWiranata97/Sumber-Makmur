import Image from "next/image";
import styles from "./page.module.css";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className={styles.page}>
      <Sidebar />

    </div>
  );
}
