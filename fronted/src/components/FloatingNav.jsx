import React, { useState } from 'react';
import styles from '../css/FloatingNav.module.css';
import { HiCubeTransparent } from "react-icons/hi2";

const FloatingNav = () => {
    const [isOpen, setIsOpen] = useState(false); // 控制菜单是否展开
    const [isHovered, setIsHovered] = useState(false); // 控制鼠标是否悬停在菜单上

    const menuItems = [
        { label: '主页', path: '/' },
        { label: '关于我们', path: '/about' },
        { label: '识别页面', path: '/identify' },
        { label: '个人中心', path: '/person' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsOpen(false); // 鼠标移开时关闭菜单
    };

    return (
        <div
            className={`${styles.floatingNav} ${isOpen || isHovered ? styles.open : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >


            {/* 菜单列表 */}
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={styles.menuItem}
                        onClick={() => (window.location.href = item.path)}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
            {/* 小球按钮 */}
            <div className={styles.floatingButton} onClick={toggleMenu}>
                <span className={styles.icon}>
                    <HiCubeTransparent />
                </span>
            </div>
        </div>
    );
};

export default FloatingNav;