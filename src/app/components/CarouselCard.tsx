"use client";

import { forwardRef } from "react";

interface CarouselCardProps {
  src: string;
}

const CarouselCard = forwardRef<HTMLDivElement, CarouselCardProps>(
  function CarouselCard({ src }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          left: "-150px",
          top: "-150px",
          borderRadius: 0,
          overflow: "hidden",
          cursor: "pointer",
          background: "#000",
        }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            userSelect: "none",
            pointerEvents: "none",
          }}
          draggable={false}
        />
      </div>
    );
  }
);

export default CarouselCard;
