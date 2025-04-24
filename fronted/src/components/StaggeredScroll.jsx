import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "../css/Scroll.module.css"
import { div } from "framer-motion/client";

const MarqueeRow = ({ images, speed }) => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marqueeContent = marqueeRef.current;

        if (marqueeContent) {
            // 计算内容总宽度
            const totalWidth = marqueeContent.scrollWidth;
            console.log(totalWidth);
            // 初始化 GSAP 动画
            const animation = gsap.to(marqueeContent, {
                x: -1552 / 2, // 滚动到中间位置（无缝衔接）
                duration: speed, // 动画持续时间（控制速度）
                ease: "none", // 匀速滚动
                repeat: -1, // 无限循环
                modifiers: {
                    x: gsap.utils.unitize(x => parseFloat(x) % (totalWidth / 2)) // 无缝衔接
                }
            });

            // 清理动画
            return () => {
                animation.kill();
            };
        }
    }, [images, speed]);

    return (
        <div style={{
            width: "150vw",
            overflow: "hidden",
        }}>
            <div ref={marqueeRef} 
            style={{
                display: "flex",
                // overflow: "hidden",
                // overflowX: "hidden",
                width: "100vw",
                // height: "100vh",
            }}>
                {/* 原始内容 */}
                {images.map((image, index) => (
                    <img key={index} src={image} className={styles.image} alt={`Image ${index + 1}`} />
                ))}
                {/* 复制的内容 */}
                {images.map((image, index) => (
                    <img key={index + images.length} src={image} className={styles.image} alt={`Image ${index + 1}`} />
                ))}
            </div>
        </div>
    );
};

const HorizontalScroll = () => {

    const images = [
        "/bg_img/image1.jpg",
        "/bg_img/image2.jpg",
        "/bg_img/image3.jpg",
        "/bg_img/image4.jpg",
        "/bg_img/image5.jpg",
        "/bg_img/image6.jpg",
        "/bg_img/image7.jpg",
        "/bg_img/image8.jpg",
        "/bg_img/image9.jpg",
        "/bg_img/image10.jpg",
        "/bg_img/image11.jpg",
        "/bg_img/image12.jpg",
        "/bg_img/image13.jpg",
        "/bg_img/image14.jpg",
        "/bg_img/image15.jpg",
        "/bg_img/image16.jpg",
        "/bg_img/image17.jpg",
        "/bg_img/image18.jpg",
        "/bg_img/image19.jpg",
        "/bg_img/image20.jpg",
        "/bg_img/image21.jpg",
        "/bg_img/image22.jpg",
        "/bg_img/image23.jpg",
        "/bg_img/image24.jpg",
        "/bg_img/image25.jpg",
        "/bg_img/image26.jpg",
        "/bg_img/image27.jpg",
        "/bg_img/image28.jpg",
        "/bg_img/image29.jpg",
        "/bg_img/image30.jpg"
    ];



    return (
        <div style={{
            translateZ: "50px",
            perspective: "1000px",
        }}>
            <div
                style={{
                    display: "flex",
                    overflowX: "hidden",
                    flexDirection: "column",
                    transform: "rotateY(15deg) translateX(50px)",
                }}
            >
                <MarqueeRow images={images} speed={22} />
                <MarqueeRow images={images} speed={20} />
                <MarqueeRow images={images} speed={18} />
            </div>
        </div>
    );
};

export default HorizontalScroll;