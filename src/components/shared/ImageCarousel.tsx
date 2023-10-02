import React from "react";
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import styles from "@/css/embala.module.css";

interface Props {
  images: string[];
  options?: EmblaOptionsType;
}

function ImageCarousel({ images, options }: Props) {
  const [emblaRef] = useEmblaCarousel(options, [Autoplay()]);
  return (
    <section className={styles.carousel}>
      <div className={styles.embla}>
        <div className={styles.embla__viewport} ref={emblaRef}>
          <div className={styles.embla__container}>
            {images.map((image, index) => (
              <div className={styles.embla__slide} key={index}>
                {/* <div className={styles.embla__slide__number}>
                <span>{index + 1}</span>
              </div> */}
                {/* <img
                className={styles.embla__slide__img}
                src={image}
                alt="Your alt text"
              /> */}
                <Image
                  src={image}
                  // className="min-w-[256px] max-w-[512px]"
                  width={256}
                  height={256}
                  //style={{ maxWidth: "256px", height: "auto" }}
                  placeholder="blur"
                  //sizes="100vw"
                  blurDataURL={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
                  }
                  alt={"tool-image"}
                  className={styles.embla__slide__img}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ImageCarousel;
