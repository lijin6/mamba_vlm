import styles from '../css/Building.module.css'

export default function Building(){
    return (
        <div className={styles.container}>
        <h1 className={styles.building_h1}>页面正在建设中</h1>
        <p className={styles.building_p}>我们正在努力完善这个页面，预计将在不久后上线！感谢您的耐心等待。</p>
        <div className={styles.loader}></div>
      </div>
    );
}